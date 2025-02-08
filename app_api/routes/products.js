const express = require("express");

const router = express.Router();

const multer = require("multer"); // Import multer for file uploads
const upload = multer({ dest: "uploads/" }); // Set up multer for file uploads

const productsController = require("../controllers/productsController");


const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Definisi rute untuk produk
router.get("/", productsController.getAllProducts);
router.post("/", authMiddleware, roleMiddleware("admin"), upload.single("foto"), productsController.createProducts);
router.get("/:id", productsController.getProductsById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), upload.single("foto"), productsController.updateProducts);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), productsController.deleteProducts);

module.exports = router;
