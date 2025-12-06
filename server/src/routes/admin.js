const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

//(placeholder demo)
router.get("/orders", adminController.getRecentOrders);
router.get("/customers", adminController.getRecentCustomers);

module.exports = router;