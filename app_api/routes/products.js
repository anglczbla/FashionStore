const express = require("express");

const router = express.Router();

const productsController = require("../controllers/productsController");

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

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Definisi rute untuk produk
router.get("/", productsController.getAllProducts);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("foto"),
  productsController.createProducts
);

router.get("/:id", productsController.getProductsById);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productsController.updateProducts
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productsController.deleteProducts
);

module.exports = router;
