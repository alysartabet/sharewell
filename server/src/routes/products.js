const express = require("express");
const router = express.Router();

const productsController = require("../controllers/productsController");

// GET /api/products
router.get("/", productsController.getAllProducts);

// GET /api/products/:id
router.get("/:id", productsController.getProductById);

// GET /api/products/search?q=...
router.get("/search/query", productsController.searchProducts);

module.exports = router;