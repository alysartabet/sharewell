const db = require("../db");

// GET /api/customers
async function getAllCustomers(req, res) {
  try {
     const result = await db.query(`
      SELECT
        c.id,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.xp_balance,
        c.membership_tier_id,
        mt.name AS membership_tier_name
      FROM customers c
      LEFT JOIN membership_tiers mt
        ON c.membership_tier_id = mt.id
      ORDER BY c.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers",  detail: err.message });
  }
}

// GET /api/customers/:id
async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
      const result = await db.query(
      `
      SELECT
        c.id,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.xp_balance,
        c.membership_tier_id,
        mt.name AS membership_tier_name
      FROM customers c
      LEFT JOIN membership_tiers mt
        ON c.membership_tier_id = mt.id
      WHERE c.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching customer by id:", err);
    res.status(500).json({ error: "Failed to fetch customer",  detail: err.message });
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById,
};
