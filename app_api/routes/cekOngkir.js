const express = require("express");
const router = express.Router();
const cekOngkirController = require("../controllers/cekOngkirController"); // Corrected import

router.post("/cekOngkir", cekOngkirController.cekOngkir);

module.exports = router;