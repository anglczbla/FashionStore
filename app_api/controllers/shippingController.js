const Shipping = require("../models/shipping");
const express = require("express");
const router = express.Router();

// Mengambil semua data Shipping
const getAllShipping = async (req, res) => {
    try {
        console.log("Mengambil semua data Shipping...");
        const shipping = await Shipping.find().populate("payment_id");
        console.log("Data Shipping berhasil diambil:", shipping);
        res.status(200).json(shipping);
    } catch (err) {
        console.error("Terjadi kesalahan saat mengambil data Shipping:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Mengambil data Shipping berdasarkan ID
const getShippingById = async (req, res) => {
    try {
        console.log("Mencari Shipping dengan ID:", req.params.id);
        const shipping = await Shipping.findById(req.params.id).populate("payment_id");
        if (!shipping) {
            console.warn("Shipping tidak ditemukan dengan ID:", req.params.id);
            return res.status(404).json({ message: "Shipping not found" });
        }
        console.log("Data Shipping ditemukan:", shipping);
        res.status(200).json(shipping);
    } catch (err) {
        console.error("Terjadi kesalahan saat mencari Shipping:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Membuat data Shipping baru
const createShipping = async (req, res) => {
    console.log("Menerima data untuk membuat Shipping:", req.body);

    if (!req.body.payment_id || !req.body.address) {
        console.warn("Data Shipping tidak valid:", req.body);
        return res.status(400).json({ message: "payment_id dan address harus diisi." });
    }

    const shipping = new Shipping({
        payment_id: req.body.payment_id,
        address: req.body.address,
        status: req.body.status || "processing",
        shippingDate: req.body.shippingDate,
        trackingNumber: req.body.trackingNumber,
    });

    try {
        const newShipping = await shipping.save();
        console.log("Data Shipping baru berhasil dibuat:", newShipping);
        res.status(201).json(newShipping);
    } catch (err) {
        console.error("Terjadi kesalahan saat membuat Shipping:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// Memperbarui data Shipping berdasarkan ID
const updateShipping = async (req, res) => {
    console.log("Menerima data untuk memperbarui Shipping:", req.body);

    const { payment_id, address, status, shippingDate, trackingNumber } = req.body;

    try {
        console.log("Mencari Shipping dengan ID:", req.params.id);
        const shipping = await Shipping.findById(req.params.id);
        if (!shipping) {
            console.warn("Shipping tidak ditemukan dengan ID:", req.params.id);
            return res.status(404).json({ message: "Shipping not found" });
        }
        shipping.payment_id = payment_id ?? shipping.payment_id;
        shipping.address = address ?? shipping.address;
        shipping.status = status ?? shipping.status;
        shipping.shippingDate = shippingDate ?? shipping.shippingDate;
        shipping.trackingNumber = trackingNumber ?? shipping.trackingNumber;

        const updatedShipping = await shipping.save();
        console.log("Data Shipping berhasil diperbarui:", updatedShipping);
        res.json(updatedShipping);
    } catch (error) {
        console.error("Terjadi kesalahan saat memperbarui Shipping:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Menghapus data Shipping berdasarkan ID
const deleteShipping = async (req, res) => {
    try {
        console.log("Mencari Shipping untuk dihapus dengan ID:", req.params.id);
        const shipping = await Shipping.findById(req.params.id);
        if (!shipping) {
            console.warn("Shipping tidak ditemukan dengan ID:", req.params.id);
            return res.status(404).json({ message: "Shipping not found" });
        }
        await shipping.deleteOne();
        console.log("Shipping berhasil dihapus dengan ID:", req.params.id);
        res.status(200).json({ message: "Shipping deleted" });
    } catch (err) {
        console.error("Terjadi kesalahan saat menghapus Shipping:", err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllShipping,
    getShippingById,
    createShipping,
    updateShipping,
    deleteShipping,
};