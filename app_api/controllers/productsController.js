const { v2: cloudinary } = require('cloudinary');
const fs = require("fs");

// Configuration for Cloudinary
cloudinary.config({ 
    cloud_name: 'dvllzlypd', 
    api_key: '275885613478582', 
    api_secret: 'SycvKGfFNPF2z5ASniYN9vc86-Q' // Jangan hardcode API secret di sini!
});

const Products = require("../models/products");

// Mengambil semua produk
const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mengambil produk berdasarkan ID
const getProductsById = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Membuat produk baru
const createProducts = async (req, res) => {
    console.log("Incoming request body:", req.body);
    console.log("Incoming request file:", req.file);
    try {
        // Validasi input
        if (!req.body.nama || !req.body.nama) {
            return res.status(400).json({ message: "Nama dan harga harus diisi." });
        }
        let fotoUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            fotoUrl = result.secure_url;
            // Hapus file lokal setelah sukses upload ke Cloudinary
            fs.unlinkSync(req.file.path);
        }
        const newProduct = new Products({
            nama: req.body.nama,
            deskripsi: req.body.deskripsi,
            harga: req.body.harga,
            kategori: req.body.kategori,
            stok: req.body.stok,
            brand: req.body.brand,
            size: req.body.size,
            foto: fotoUrl,
        });
        const savedProduct = await newProduct.save();
        console.log("Produk baru berhasil dibuat:", savedProduct);
        res.status(201).json(savedProduct);

    } catch (err) {
        console.error("Terjadi kesalahan saat membuat produk:", err);
        res.status(500).json({ message: "Gagal membuat produk", error: err.message });
    }
};

// Memperbarui produk
const updateProducts = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            product.foto = uploadResult.secure_url;
            fs.unlinkSync(req.file.path);
        }

        product.nama = req.body.nama || product.nama;
        product.deskripsi = req.body.deskripsi || product.deskripsi;
        product.harga = req.body.harga || product.harga;
        product.kategori = req.body.kategori || product.kategori;
        product.stok = req.body.stok || product.stok;
        product.brand = req.body.brand || product.brand;
        product.size = req.body.size || product.size;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Menghapus produk berdasarkan ID
const deleteProducts = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.foto) {
            await cloudinary.uploader.destroy(product.foto);
        }

        await product.deleteOne();
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllProducts, getProductsById, createProducts, updateProducts, deleteProducts };
