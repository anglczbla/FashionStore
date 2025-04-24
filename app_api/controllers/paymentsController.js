const Payment = require("../models/payments");
const express = require("express");
const router = express.Router();
//const orders = require('../models/orders');

// Mengambil semua data Payment
const getAllPayments = async (req, res) => {
    try {
        console.log("Mengambil semua data Payment...");
        const payments = await Payment.find().populate("orders_id");
        console.log("Data Payment berhasil diambil:", payments);
        res.status(200).json(payments);
    } catch (err) {
        console.error("Terjadi kesalahan saat mengambil data Payment:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Mengambil data Payment berdasarkan ID
const getPaymentById = async (req, res) => {
    try {
        console.log("Mencari Payment dengan ID:", req.params.id);
        const payment = await Payment.findById(req.params.id).populate("orders_id");
        if (!payment) {
            console.warn("Payment tidak ditemukan dengan ID:", req.params.id);
            return res.status(404).json({ message: "Payment not found" });
        }
        console.log("Data Payment ditemukan:", payment);
        res.status(200).json(payment);
    } catch (err) {
        console.error("Terjadi kesalahan saat mencari Payment:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Membuat data Payment baru
const createPayment = async (req, res) => {
    console.log("Menerima data untuk membuat Payment:", req.body);

    if (!req.body.orders_id || !req.body.amount || !req.body.paymentMethod) {
        console.warn("Data Payment tidak valid:", req.body);
        return res.status(400).json({ message: "orders_id, amount, dan paymentMethod harus diisi." });
    }

    const payment = new Payment({
        orders_id: req.body.orders_id,
        amount: req.body.amount,
        paymentMethod: req.body.paymentMethod,
        status: req.body.status || "pending",
        paymentDate: req.body.paymentDate
    });

    try {
        const newPayment = await payment.save();
        console.log("Data Payment baru berhasil dibuat:", newPayment);
        res.status(201).json(newPayment);
    } catch (err) {
        console.error("Terjadi kesalahan saat membuat Payment:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// Memperbarui data Payment berdasarkan ID
const updatePayment = async (req, res) => {
    console.log("Menerima data untuk memperbarui Payment:", req.body);

    const { orders_id, amount, paymentMethod, status, paymentDate} = req.body;


    try {
        console.log("Mencari Payment dengan ID:", req.params.id);
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            console.warn("Payment tidak ditemukan dengan ID:", req.params.id);
            return res.status(404).json({ message: "Payment not found" });
        }
        payment.orders_id = orders_id ?? payment.orders_id
        payment.amount = amount ?? payment.amount;
        payment.paymentMethod = paymentMethod ?? payment.paymentMethod;
        payment.status = status ?? payment.status;
        payment.paymentDate = paymentDate ?? payment.paymentDate;

        const updatedPayment = await payment.save();
        console.log("Data Payment berhasil diperbarui:", updatedPayment);
        res.json(updatedPayment);
    } catch (error) {
        console.error("Terjadi kesalahan saat memperbarui Payment:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Menghapus data Payment berdasarkan ID
const deletePayment = async (req, res) => {
    try {
        console.log("Mencari Payment untuk dihapus dengan ID:", req.params.id);
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            console.warn("Payment tidak ditemukan dengan ID:", req.params.id);
            return res.status(404).json({ message: "Payment not found" });
        }
        await payment.deleteOne();
        console.log("Payment berhasil dihapus dengan ID:", req.params.id);
        res.status(200).json({ message: "Payment deleted" });
    } catch (err) {
        console.error("Terjadi kesalahan saat menghapus Payment:", err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
};
