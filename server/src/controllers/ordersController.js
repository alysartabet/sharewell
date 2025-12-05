const db = require("../db");
const xpService = require("../services/xpService");
const equityService = require("../services/equityService");

// POST /api/orders
// Body: { customerId, items: [{ productId, quantity }], createdByAdminId? }
async function createOrder(req, res) {
  const { customerId, items, createdByAdminId } = req.body;

  if (!customerId || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Missing customerId or items in request body" });
  }

  try {
    const result = await db.withTransaction(async (client) => {
      // Validate customer
      const { rows: customerRows } = await client.query(
        `SELECT id FROM customers WHERE id = $1`,
        [customerId]
      );
      if (!customerRows.length) {
        const err = new Error("Customer not found");
        err.status = 404;
        throw err;
      }

      // Fetch product info
      const productIds = items.map((it) => Number(it.productId));
      const { rows: productRows } = await client.query(
        `
        SELECT id, price, inventory_qty, is_active
        FROM products
        WHERE id = ANY($1::bigint[])
        `,
        [productIds]
      );

      if (productRows.length !== productIds.length) {
        const err = new Error("One or more products not found");
        err.status = 400;
        throw err;
      }

      //Normalize map keys to numbers
      const productMap = new Map();
      for (const p of productRows) {
        productMap.set(Number(p.id), p);
      }

      // Validate quantities & compute total
      let subtotal = 0; 

      for (const item of items) {
        const productId = Number(item.productId);
        const product = productMap.get(productId);

        if (!product || !product.is_active) {
          const err = new Error(`Invalid or inactive product: ${productId}`);
          err.status = 400;
          throw err;
        }

        const qty = Number(item.quantity);
        if (!qty || qty <= 0) {
          const err = new Error(
            `Invalid quantity for product ${productId}`
          );
          err.status = 400;
          throw err;
        }

        const currentStock = Number(product.inventory_qty);
        if (currentStock < qty) {
          const err = new Error(
            `Insufficient inventory for product ${productId}`
          );
          err.status = 400;
          throw err;
        }

        const price = Number(product.price); 
        const lineTotal = price * qty;
        subtotal += lineTotal;
      }

      // Apply membership discounts and tax here
      const discount = 0; //plug membership discounts here later
      const taxRate = 0.08875; // NYC-ish
      const tax = Math.round(subtotal * taxRate * 100) / 100;
      const total = subtotal - discount + tax;

      // Insert into orders
      const { rows: orderRows } = await client.query(
        `
        INSERT INTO orders (
          customer_id,
          status,
          subtotal_amount,
          discount_amount,
          tax_amount,
          total_amount,
          created_by_admin_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          customer_id,
          status,
          subtotal_amount,
          discount_amount,
          tax_amount,
          total_amount,
          created_at
        `,
        [
          customerId,
          "paid", // or 'pending' if you add a payment step
          subtotal,
          discount,
          tax,
          total,
          createdByAdminId || null,
        ]
      );

      const order = orderRows[0];


      // Insert order items & decrement stock
      for (const item of items) {
        const productId = Number(item.productId)
        const product = productMap.get(productId);
        const price = Number(product.price);
        const qty = Number(item.quantity);

        // order_items.unit_price is NUMERIC(10,2), line_total is generated
        await client.query(
          `
          INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            unit_price
          )
          VALUES ($1, $2, $3, $4)
          `,
          [order.id, productId, qty, price]
        );

        // Decrement inventory_qty
        await client.query(
          `
          UPDATE products
          SET inventory_qty = inventory_qty - $1
          WHERE id = $2
          `,
          [qty, productId]
        );
      }

      // XP logic
      let xpTransaction = null;
      if (xpService && typeof xpService.awardXpForOrder === "function") {
        xpTransaction = await xpService.awardXpForOrder(client, {
          customerId,
          orderId: order.id,
          orderTotalCents: Math.round(Number(order.total_amount) * 100),
        });
      }

      // Equity logic
      let equityRecord = null;
      if (equityService && typeof equityService.awardEquityForOrder === "function") {
        equityRecord = await equityService.awardEquityForOrder(client, {
          customerId,
          orderId: order.id,
          orderTotalCents: Math.round(Number(order.total_amount) * 100),
        });
      }

      return { order, xpTransaction, equityRecord };
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error("Error creating order:", err);
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    return res.status(500).json({ error: "Failed to create order" });
  }
}

// GET /api/orders/history/:customerId
async function getOrderHistory(req, res) {
  const { customerId } = req.params;

  try {
    const { rows } = await db.query(
      `
      SELECT
        o.id,
        o.created_at,
        o.status,
        o.subtotal_amount,
        o.discount_amount,
        o.tax_amount,
        o.total_amount,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'line_total', oi.line_total
          )
        ) AS items
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.customer_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      `,
      [customerId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("Error fetching order history:", err);
    return res.status(500).json({
      error: "Failed to fetch order history",
      detail: err.message,
    });
  }
}

module.exports = {
  createOrder,
  getOrderHistory,
};