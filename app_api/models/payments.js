const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  // Negara
  country: {
    type: String,
    required: true,
    trim: true,
  },
  // Nama depan
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  // Nama belakang
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  // Alamat utama
  address: {
    type: String,
    required: true,
    trim: true,
  },
  // Apartemen (opsional)
  apartment: {
    type: String,
    trim: true,
    default: '',
  },
  // Kota
  city: {
    type: String,
    required: true,
    trim: true,
  },
  // Provinsi
  province: {
    type: String,
    required: true,
    trim: true,
  },
  // Kode pos
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
  // Nomor telepon
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  // Simpan info pelanggan (opsional)
  saveInfo: {
    type: Boolean,
    default: false,
  },

  // Data pembayaran
  orders_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orders",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "berhasil", "gagal"],
    default: "pending",
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
