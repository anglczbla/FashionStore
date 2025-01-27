const Review = require("../models/review");
const express = require("express");
const router = express.Router();

// Mengambil semua REVIEW dari database
const getAllReview = async (req, res) => {
    try {
        console.log("Mengambil semua data review...");
        const review = await Review.find()
            .populate("orders_id")
        console.log("Data Review berhasil diambil:", review);
        res.status(200).json(review);
    } catch (err) {
        console.error("Terjadi kesalahan saat mengambil data Review:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Mengambil Review berdasarkan ID
const getReviewById = async (req, res) => {
    try {
        console.log("Mencari Review dengan ID:", req.params.id);
        const review = await Review.findById(req.params.id)
        .populate("orders_id")
        
        if (!review) {
            console.warn("Review tidak ditemukan dengan ID:", req.params.id);
            return res.status(404).json({ message: "Review not found" });
        }
        
        console.log("Data Review ditemukan:", review);
        res.status(200).json(review);
    } catch (err) {
        console.error("Terjadi kesalahan saat mencari Review:", err.message);
        res.status(500).json({ message: err.message });
    }
};


// Membuat Review baru
const createReview = async (req, res) => {
    console.log("Menerima data untuk membuat Review:", req.body);
    const review = new Review({
        nama: req.body.nama,
        orders_id: req.body.orders_id,
        pesan: req.body.pesan,
        rating: req.body.rating,
    });

    try {
        const newReview = await review.save();
        const tes = await Review.findById(newReview.id)
        .populate("orders_id")
        console.log("Data Review baru berhasil dibuat:", newReview);
        res.status(201).json(tes);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Memperbarui data Review berdasarkan ID
const updateReview = async (req, res) => {

    console.log("Menerima data untuk memperbarui Review:", req.body);

    const { nama, orders_id, pesan, rating } = req.body;

    try {
        console.log("Mencari Review dengan ID:", req.params.id);
        const review = await Review.findById(req.params.id);
        if (!review) {
            console.warn("Review tidak ditemukan dengan ID:", req.params.id);
            return res.status(404).json({ message: "Review not found" });
        }

        review.nama = nama ?? review.nama;
        review.orders_id = orders_id ?? review.orders_id;
        review.pesan = pesan ?? review.pesan;
        review.rating = rating ?? review.rating;

        const updatedReview = await review.save();
        console.log("Data Review berhasil diperbarui:", updatedReview);
        res.json(updatedReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Menghapus Review berdasarkan ID
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        await review.deleteOne();
        res.status(200).json({ message: "Review deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllReview, getReviewById, createReview, updateReview, deleteReview };