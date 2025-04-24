const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");


// Route untuk mendapatkan semua testimoni
// router.get("/", reviewController.getAllReview);

// // Route untuk mendapatkan review berdasarkan ID
// router.get("/:id", reviewController.getReviewById);

// // Route untuk membuat review baru
// router.post("/", reviewController.createReview);

// // Route untuk memperbarui review berdasarkan ID
// router.put("/:id", reviewController.updateReview);

// // Route untuk menghapus review berdasarkan ID
// router.delete("/:id",reviewController.deleteReview);

// Definisi rute untuk produk
router.get("/", reviewController.getAllReview);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  reviewController.createReview
);

router.get("/:id", reviewController.getReviewById);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
 
  reviewController.updateReview
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  reviewController.deleteReview
);

module.exports = router;
