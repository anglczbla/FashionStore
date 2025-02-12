// Mengimpor modul mongoose untuk mengelola koneksi dengan MongoDB
const mongoose = require("mongoose");

// Mendefinisikan schema untuk produk
const productsSchema = new mongoose.Schema({
    // Field untuk nama produk
    nama: {
        type: String,
        required: true,
        trim: true,
    },
    // Field untuk deskripsi produk
    deskripsi: {
        type: String,
        required: true,
        trim: true,
    },
    // Field untuk harga produk
    harga: {
        type: Number,
        required: true,
        min: 0,
    },
    // Field untuk kategori produk
    kategori: {
        type: String,
        required: true,
        trim: true,
    },
    stok:{
        type: Number,
        required: true,
        trim: true,
    },
    brand:{
        type: String,
        required: true,
        trim: true,
    },
    size:{
        type: String,
        required: true,
        trim: true,
    },
    foto: {
        type:String,
        required: true,
    },
    // Field untuk menyimpan tanggal pembuatan data produk
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Membuat model Produk dari schema yang telah didefinisikan
const Products = mongoose.model("Products", productsSchema);

// Ekspor modul Products
module.exports = Products;
