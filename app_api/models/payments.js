// Mengimpor modul mongoose untuk mengelola koneksi dengan MongoDB
const mongoose = require("mongoose");

// Mendefinisikan schema untuk pembayaran
const paymentSchema = new mongoose.Schema({
    // ID referensi ke produk yang dibeli
    orders_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        required: true,
    },
    // Jumlah pembayaran
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    // Metode pembayaran (misalnya: "transfer bank", "kartu kredit", "e-wallet")
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    // Status pembayaran (misalnya: "pending", "berhasil", "gagal")
    status: {
        type: String,
        required: true,
        trim : true
    },
    // Tanggal pembayaran
    paymentDate: {
        type: Date,
        default: Date.now,
    },
});

// Membuat model Payment dari schema yang telah didefinisikan
const Payment = mongoose.model("Payment", paymentSchema);

// Ekspor modul Payment
module.exports = Payment;
