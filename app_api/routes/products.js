const express = require("express");

const router = express.Router();

const productsController = require("../controllers/productsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Simpan di folder 'uploads'
  },
  filename: (req, file, cb) => {
    // Ambil ekstensi asli dari file
    const ext = path.extname(file.originalname);
    // Simpan dengan nama asli + ekstensi
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// const authMiddleware = require("../middleware/authMiddleware");
// const roleMiddleware = require("../middleware/roleMiddleware");

// // Definisi rute untuk produk
// router.get("/", productsController.getAllProducts);
// router.post(
//   "/",
//   authMiddleware,
//   roleMiddleware("admin"),
//   upload.single("foto"),
//   productsController.createProducts
// );

// router.post(
//   "/",
//   productsController.createProducts
// );

// router.get("/:id", productsController.getProductsById);
// router.put(
//   "/:id",
//   authMiddleware,
//   roleMiddleware("admin"),
//   upload.single("foto"),
//   productsController.updateProducts
// );

// router.delete(
//   "/:id",
//   authMiddleware,
//   roleMiddleware("admin"),
//   productsController.deleteProducts
// );

// Route untuk mendapatkan semua testimoni
router.get("/",  productsController.getAllProducts);

// Route untuk mendapatkan shipping berdasarkan ID
router.get("/:id", authMiddleware,productsController.getProductsById);

// Route untuk membuat shipping baru
router.post("/", authMiddleware, roleMiddleware("admin"), upload.single("foto"), productsController.createProducts);

// Route untuk memperbarui shipping berdasarkan ID
router.put("/:id", authMiddleware, roleMiddleware("admin"), upload.single("foto"), productsController.updateProducts);

// Route untuk menghapus shipping berdasarkan ID
router.delete("/:id",authMiddleware, roleMiddleware("admin"),productsController.deleteProducts);

module.exports = router;
