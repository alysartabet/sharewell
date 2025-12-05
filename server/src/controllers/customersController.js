const db = require("../db");

// GET /api/customers
async function getAllCustomers(req, res) {
  try {
    const result = await db.query(
      "SELECT id, first_name, last_name, email, phone FROM customers ORDER BY id"
    );
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
      "SELECT id, first_name, last_name, email, phone FROM customers WHERE id = $1",
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
