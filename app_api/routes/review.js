const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// Route untuk mendapatkan semua testimoni
router.get("/", reviewController.getAllReview);

// Route untuk mendapatkan review berdasarkan ID
router.get("/:id", reviewController.getReviewById);

// Route untuk membuat review baru
router.post("/", reviewController.createReview);

// Route untuk memperbarui review berdasarkan ID
router.put("/:id", reviewController.updateReview);

// Route untuk menghapus review berdasarkan ID
router.delete("/:id",roleMiddleware("admin"), reviewController.deleteReview);

module.exports = router;
