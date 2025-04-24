const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stokController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("admin"), stockController.createStock);           // Create
router.get("/", stockController.getAllStocks);           // Read all
router.get("/:id", stockController.getStockById);        // Read by ID
router.put("/:id", authMiddleware, roleMiddleware("admin"),stockController.updateStock);         // Update
router.delete("/:id", authMiddleware, roleMiddleware("admin"),stockController.deleteStock);      // Delete

module.exports = router;
