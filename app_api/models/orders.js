// Mengimpor modul mongoose untuk mengelola koneksi dengan MongoDB
const mongoose = require("mongoose");

// Mendefinisikan schema untuk pemesanan
const ordersSchema = new mongoose.Schema({
    // Field untuk tanggal order
    nama: {
        type: String,
        required: true,
    },
    order: {
        type: Date,
        required: true,
    },
    // Field untuk tanggal selesai
    total: {
        type: Number,
        required: true,
    },
    // Field untuk batas order
    jumlahOrder: {
        type: Number,
        required: true,
        default : 0,
        trim: true,
    },
    
    // Field referensi ke produk yang dipesan
    products_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
    },
    // Field untuk menyimpan tanggal pembuatan data pemesanan
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Membuat model Pemesanan dari schema yang telah didefinisikan
const Orders = mongoose.model("Orders", ordersSchema);

// Ekspor modul Pemesanan
module.exports = Orders;
