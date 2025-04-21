const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stokController");

router.post("/", stockController.createStock);           // Create
router.get("/", stockController.getAllStocks);           // Read all
router.get("/:id", stockController.getStockById);        // Read by ID
router.put("/:id", stockController.updateStock);         // Update
router.delete("/:id", stockController.deleteStock);      // Delete

module.exports = router;
