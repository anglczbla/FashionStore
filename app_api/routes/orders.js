const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/OrdersController");

// Route untuk mendapatkan semua data orders
router.get("/", ordersController.getAllOrders);

// Route untuk membuat data orders baru
router.post("/",ordersController.createOrders);

// Route untuk mendapatkan data orders berdasarkan ID
router.get("/:id", ordersController.getOrdersById);

// Route untuk memperbarui data orders berdasarkan ID
router.put("/:id", ordersController.updateOrders);

// Route untuk menghapus data orders berdasarkan ID
router.delete("/:id", ordersController.deleteOrders);

module.exports = router;
