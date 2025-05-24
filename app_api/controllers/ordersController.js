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
  try {
    const { nama, order, total, jumlahOrder, products_id } = req.body;

    // Cari produk berdasarkan products_id
    const product = await Products.findById(products_id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Cek stok produk apakah cukup
    if (product.stok < jumlahOrder) {
      return res.status(400).json({ message: "Stok produk tidak mencukupi" });
    }

    // Jika cukup, buat data order baru
    const newOrder = new Orders({
      nama,
      order,
      total,
      jumlahOrder,
      products_id,
    });

    // Simpan order
    const savedOrder = await newOrder.save();

    // Kurangi stok produk
    product.stok -= jumlahOrder;
    await product.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
