const db = require("../db");

// GET /api/admin/orders
async function getRecentOrders(req, res) {
  try {
    const { rows } = await db.query(`
      SELECT
        o.id,
        o.created_at,
        o.status,
        o.total_amount,
        c.first_name,
        c.last_name,
        c.email
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      ORDER BY o.id DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching admin orders:", err);
    res.status(500).json({ error: "Failed to fetch orders", detail: err.message });
  }
}

// GET /api/admin/customers
async function getRecentCustomers(req, res) {
  try {
    const { rows } = await db.query(`
      SELECT
        c.id,
        c.first_name,
        c.last_name,
        c.email,
        c.xp_balance,
        c.membership_tier_id,
        mt.name AS membership_tier_name,
        COALESCE(eq.total_equity, 0) AS total_equity
      FROM customers c
      LEFT JOIN membership_tiers mt
        ON c.membership_tier_id = mt.id
      LEFT JOIN (
        SELECT
          customer_id,
          SUM(equity_units) AS total_equity
        FROM equity_records
        GROUP BY customer_id
      ) eq
        ON eq.customer_id = c.id
      ORDER BY c.id DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching admin customers:", err);
    res.status(500).json({ error: "Failed to fetch customers", detail: err.message });
  }
}

module.exports = {
  getRecentOrders,
  getRecentCustomers,
};
