const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Definisi rute untuk produk
router.get("/", paymentController.getAllPayment);
router.post("/", authMiddleware, roleMiddleware("admin"), paymentController.createPayment);
router.get("/:id", paymentController.getpaymentById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), paymentController.updatePayment);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), paymentController.deletePayment);

module.exports = router;
