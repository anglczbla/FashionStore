const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require ("../middleware/roleMiddleware");

// Route untuk mendapatkan semua testimoni
router.get("/", shippingController.getAllShipping);

// Route untuk mendapatkan shipping berdasarkan ID
router.get("/:id", shippingController.getShippingById);

// Route untuk membuat shipping baru
router.post("/", shippingController.createShipping);

// Route untuk memperbarui shipping berdasarkan ID
router.put("/:id", authMiddleware, roleMiddleware("admin"), shippingController.updateShipping);

// Route untuk menghapus shipping berdasarkan ID
router.delete("/:id", authMiddleware, roleMiddleware("admin"),shippingController.deleteShipping);

module.exports = router;
