const Orders = require("../models/orders");
const express = require("express");
const router = express.Router();
const Products = require("../models/products");

// Mengambil semua data Orders
const getAllOrders = async (req, res) => {
  try {
    console.log("Mengambil semua data Orders...");
    const orders = await Orders.find().populate("products_id");
    console.log("Data Orders berhasil diambil:", orders);
    res.status(200).json(orders);
  } catch (err) {
    console.error("Terjadi kesalahan saat mengambil data Orders:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Mengambil data Orders berdasarkan ID
const getOrdersById = async (req, res) => {
  try {
    console.log("Mencari Orders dengan ID:", req.params.id);
    const orders = await Orders.findById(req.params.id).populate("products_id");
    if (!orders) {
      console.warn("Orders tidak ditemukan dengan ID:", req.params.id);
      return res.status(404).json({ message: "Orders not found" });
    }
    console.log("Data Orders ditemukan:", orders);
    res.status(200).json(orders);
  } catch (err) {
    console.error("Terjadi kesalahan saat mencari Orders:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Membuat data Orders baru
const createOrders = async (req, res) => {
  console.log("Menerima data untuk membuat Orders:", req.body);

  // Validasi sederhana
  if (!req.body.products_id || !req.body.order) {
    console.warn("Data Orders tidak valid:", req.body);
    return res
      .status(400)
      .json({ message: "products_id dan order harus diisi." });
  }
  // Validasi stok cukup
  if (products.stok < jumlahOrder) {
    return res.status(400).json({ message: "Stok produk tidak mencukupi" });
  }

  // Kurangi stok
  products.stok -= jumlahOrder;
  await products.save();

  // Simpan order
  const newOrder = new Order({ nama, order, total, jumlahOrder, products_id });
  await newOrder.save();

  const orders = new Orders({
    nama: req.body.nama,
    order: req.body.order,
    total: req.body.total,
    jumlahOrder: req.body.jumlahOrder,
    products_id: req.body.products_id,
  });

  try {
    const newOrders = await orders.save();
    console.log("Data Orders baru berhasil dibuat:", newOrders);
    res.status(201).json(newOrders);
  } catch (err) {
    console.error("Terjadi kesalahan saat membuat Orders:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Memperbarui data Orders berdasarkan ID
const updateOrders = async (req, res) => {
  console.log("Menerima data untuk memperbarui Orders:", req.body);

  const { nama, order, total, jumlahOrder, products_id } = req.body;

  try {
    console.log("Mencari Orders dengan ID:", req.params.id);
    const orders = await Orders.findById(req.params.id);
    if (!orders) {
      console.warn("Orders tidak ditemukan dengan ID:", req.params.id);
      return res.status(404).json({ message: "Orders not found" });
    }

    // Perbarui field Orders
    orders.nama = nama ?? orders.nama;
    orders.order = order ?? orders.order;
    orders.total = total ?? orders.total;
    orders.jumlahOrder = jumlahOrder ?? orders.jumlahOrder;
    orders.products_id = products_id ?? orders.products_id;

    const updatedOrders = await orders.save();
    console.log("Data Orders berhasil diperbarui:", updatedOrders);
    res.json(updatedOrders);
  } catch (error) {
    console.error("Terjadi kesalahan saat memperbarui Orders:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Menghapus data Orders berdasarkan ID
const deleteOrders = async (req, res) => {
  try {
    console.log("Mencari Orders untuk dihapus dengan ID:", req.params.id);
    const orders = await Orders.findById(req.params.id);
    if (!orders) {
      console.warn("Orders tidak ditemukan dengan ID:", req.params.id);
      return res.status(404).json({ message: "Orders not found" });
    }

    await orders.deleteOne();
    console.log("Orders berhasil dihapus dengan ID:", req.params.id);
    res.status(200).json({ message: "Orders deleted" });
  } catch (err) {
    console.error("Terjadi kesalahan saat menghapus Orders:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllOrders,
  createOrders,
  getOrdersById,
  updateOrders,
  deleteOrders,
};
