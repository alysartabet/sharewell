const express = require("express");
const router = express.Router();

const customersController = require("../controllers/customersController");

// GET /api/customers
router.get("/", customersController.getAllCustomers);

// GET /api/customers/:id
router.get("/:id", customersController.getCustomerById);

module.exports = router;
