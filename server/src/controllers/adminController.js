const db = require("../db");

// GET /api/admin/orders
async function getRecentOrders(req, res) {
  try {
    const { rows } = await db.query(
      `
      SELECT
        o.id,
        o.created_at,
        o.status,
        o.total_amount_cents,
        c.first_name,
        c.last_name,
        c.email
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      ORDER BY o.created_at DESC
      LIMIT 100
      `
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching admin orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// GET /api/admin/customers
async function getRecentCustomers(req, res) {
  try {
    const { rows } = await db.query(
      `
      SELECT
        c.id,
        c.first_name,
        c.last_name,
        c.email,
        c.xp_balance,
        c.membership_tier_id
      FROM customers c
      ORDER BY c.created_at DESC
      LIMIT 100
      `
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching admin customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
}

module.exports = {
  getRecentOrders,
  getRecentCustomers,
};