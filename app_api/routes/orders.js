const express = require("express");
const Orders = require('../models/orders');
const router = express.Router();
const ordersController = require("../controllers/ordersController"); // Corrected import
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Route untuk mendapatkan semua data orders
router.get("/", ordersController.getAllOrders);

// Route untuk membuat data orders baru
// router.post("/", authMiddleware, roleMiddleware("admin"), ordersController.createOrders);
router.post("/", ordersController.createOrders);

// Route untuk mendapatkan data orders berdasarkan ID
router.get("/:id", ordersController.getOrdersById);

// Route untuk memperbarui data orders berdasarkan ID
router.put("/:id", authMiddleware, roleMiddleware("admin"), ordersController.updateOrders);

// Route untuk menghapus data orders berdasarkan ID
router.delete("/:id", authMiddleware, roleMiddleware("admin"), ordersController.deleteOrders);

module.exports = router;
