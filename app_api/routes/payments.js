const express = require("express");
const router = express.Router();

// Placeholder for payment-related functions
const getAllPayments = (req, res) => {
    res.send("Get all payments");
};

const createPayment = (req, res) => {
    res.send("Create a payment");
};

// Define routes
router.get("/", getAllPayments);
router.post("/", createPayment);

module.exports = router;
