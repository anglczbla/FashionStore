const Stok = require("../models/stok");
const Products = require("../models/products");

// CREATE: Tambah stok baru untuk produk tertentu
const createStock = async (req, res) => {
    try {
        const { products_id, jumlah } = req.body;

        const product = await Products.findById(products_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingStock = await Stok.findOne({ products_id });
        if (existingStock) {
            return res.status(400).json({ message: "Stok untuk produk ini sudah ada." });
        }

        const newStock = new Stok({ products_id, jumlah });
        const savedStock = await newStock.save();

        res.status(201).json(savedStock);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Ambil semua stok
const getAllStocks = async (req, res) => {
    try {
        const stocks = await Stok.find().populate("products_id", "nama");
        res.status(200).json(stocks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Ambil stok berdasarkan ID
const getStockById = async (req, res) => {
    try {
        const stock = await Stok.findById(req.params.id).populate("products_id", "nama");
        if (!stock) {
            return res.status(404).json({ message: "Stok not found" });
        }
        res.status(200).json(stock);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE: Update jumlah stok
const updateStock = async (req, res) => {
    try {
        const { jumlah } = req.body;

        const stock = await Stok.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({ message: "Stok not found" });
        }

        stock.jumlah = jumlah;
        const updatedStock = await stock.save();
        res.status(200).json(updatedStock);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE: Hapus stok
const deleteStock = async (req, res) => {
    try {
        const stock = await Stok.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({ message: "Stok not found" });
        }

        await stock.deleteOne();
        res.status(200).json({ message: "Stok deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createStock,
    getAllStocks,
    getStockById,
    updateStock,
    deleteStock
};
