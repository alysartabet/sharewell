const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/ordersController");

// POST /api/orders  -> cart checkout
router.post("/", ordersController.createOrder);

// GET /api/orders/history/:customerId
router.get("/history/:customerId", ordersController.getOrderHistory);

module.exports = router;