// Mengimpor modul mongoose untuk mengelola koneksi dengan MongoDB
const mongoose = require("mongoose");

// Mendefinisikan schema untuk pengiriman
const shippingSchema = new mongoose.Schema({
    // ID referensi ke pembayaran yang terkait
    payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
    },
    // Alamat pengiriman
    address: {
        type: String,
        required: true,
        trim: true,
    },
    // Status pengiriman (misalnya: "diproses", "dikirim", "diterima")
    status: {
        type: String,
        required: true,
        trim : true
    },
    // Tanggal pengiriman
    shippingDate: {
        type: Date,
        default: Date.now,
    },
    // Nomor resi pengiriman
    trackingNumber: {
        type: String,
        required: false,
        trim: true,
    },
});

// Membuat model Shipping dari schema yang telah didefinisikan
const Shipping = mongoose.model("Shipping", shippingSchema);

// Ekspor modul Shipping
module.exports = Shipping;