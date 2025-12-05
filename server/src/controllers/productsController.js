const db = require("../db");

// GET /api/products
async function getAllProducts(req, res) {
  try {
    const result = await db.query(
      `
      SELECT
        id,
        name,
        description,
        sku,
        price,
        inventory_qty,
        is_active,
        supplier_id
      FROM products
      ORDER BY id
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      error: "Failed to fetch products",
      detail: err.message,
    });
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT
        id,
        name,
        description,
        sku,
        price,
        inventory_qty,
        is_active,
        supplier_id
      FROM products
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching product by id:", err);
    res.status(500).json({
      error: "Failed to fetch product",
      detail: err.message,
    });
  }
}

//GET /api/products/search?q=rice
async function searchProducts(req, res) {
  const q = (req.query.q || "").trim();

  if (!q) {
    return res.status(400).json({ error: "Missing search query ?q=" });
  }

  try {
    const result = await db.query(
      `
      SELECT
        id,
        name,
        description,
        sku,
        price,
        inventory_qty,
        is_active,
        supplier_id
      FROM products
      WHERE
        name ILIKE '%' || $1 || '%'
        OR description ILIKE '%' || $1 || '%'
        OR sku ILIKE '%' || $1 || '%'
      ORDER BY name
      `,
      [q]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error searching products:", err);
    res.status(500).json({
      error: "Failed to search products",
      detail: err.message,
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
};