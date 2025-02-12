const express = require("express");

const router = express.Router();



const productsController = require("../controllers/productsController");


const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Definisi rute untuk produk
router.get("/", productsController.getAllProducts);
router.post("/", authMiddleware, roleMiddleware("admin"), uploadToCloudinary, productsController.createProducts);


router.get("/:id", productsController.getProductsById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), productsController.updateProducts);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), productsController.deleteProducts);

module.exports = router;
