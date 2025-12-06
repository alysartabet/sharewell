const express = require("express");
const cors = require("cors");
require("dotenv").config();

const customerRoutes = require("./routes/customers");
const orderRoutes = require("./routes/orders");
const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check / root
app.get("/", (req, res) => {
  res.send("Sharewell API running ✅");
});

app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;