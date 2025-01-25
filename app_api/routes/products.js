const express = require("express");

const router = express.Router();

const productsController = require("../controllers/productsControllers");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Definisi rute untuk fakultas
// Mengatur rute GET untuk mendapatkan semua data fakultas
router.get("/", productsController.getAllproducts);
// Mengatur rute POST untuk membuat data fakultas baru
router.post("/", authMiddleware,roleMiddleware ("admin") ,productsController.createproducts);
// Mengatur rute GET untuk mendapatkan data fakultas berdasarkan ID
router.get("/:id", productsController.getproductsById);
// Mengatur rute PUT untuk memperbarui data fakultas berdasarkan ID
router.put("/:id", authMiddleware,roleMiddleware ("admin") ,productsController.updateproducts);
// Mengatur rute DELETE untuk menghapus data fakultas berdasarkan ID
router.delete("/:id", authMiddleware,roleMiddleware ("admin") ,productsController.deleteproducts);



module.exports = router;