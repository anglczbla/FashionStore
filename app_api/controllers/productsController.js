const { v2: cloudinary } = require('cloudinary');
const fs = require("fs");
const path = require("path");

// Configuration for Cloudinary
cloudinary.config({ 
    cloud_name: 'dvllzlypd', 
    api_key: '275885613478582', 
    api_secret: 'SycvKGfFNPF2z5ASniYN9vc86-Q' // Replace with your actual API secret
});

const Products = require("../models/products");

// Mengambil semua produk dari database
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
        const products = await Products.findById(req.params.id);
        if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Membuat produk baru
const createProducts = async (req, res) => {
    console.log("Incoming request body:", req.body); // Log the incoming request body
    console.log("Incoming request file:", req.file); // Log the incoming request body

    // Validasi sederhana
    // if (!req.body.products_id || !req.body.products || !req.body.nama || !req.body.harga) {
    //     console.warn("Data Products tidak valid:", req.body);
    //     return res.status(400).json({ message: "products_id, products, nama, dan harga harus diisi." });
    // }

    // if (!req.file) {
    //     return res.status(400).json({ message: "File tidak ditemukan." });
    // }

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // Hapus file lokal setelah upload

    console.log(result)

    res.json({
      message: "Upload berhasil!",
      imageUrl: result.secure_url,
    });

    return

    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    const products = new Products({
        nama: req.body.nama,
        deskripsi: req.body.deskripsi,
        harga: req.body.harga,
        kategori: req.body.kategori,
        stok: req.body.stok,
        brand: req.body.brand,
        size: req.body.size,
        foto: uploadResult.secure_url, // Store the Cloudinary URL
    });

    try {
        const newProducts = await products.save();
        console.log("Data Orders baru berhasil dibuat:", newProducts);
        res.status(201).json(newProducts);
    } catch (err) {
        console.error("Terjadi kesalahan saat membuat Products:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// Memperbarui data produk berdasarkan ID
const updateProducts = async (req, res) => {
    try {
        const products = await Products.findById(req.params.id);
        if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (req.file) {
            //jika ada file foto baru
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            products.foto = uploadResult.secure_url; // Update with new Cloudinary URL
        }

        if (req.body.nama != null) {
            products.nama = req.body.nama;
        }
        if (req.body.deskripsi != null) {
            products.deskripsi = req.body.deskripsi;
        }
        if (req.body.harga != null) {
            products.harga = req.body.harga;
        }
        if (req.body.kategori != null) {
            products.kategori = req.body.kategori;
        }
        if (req.body.stok != null) {
            products.stok = req.body.stok;
        }
        if (req.body.brand != null) {
            products.brand = req.body.brand;
        }
        if (req.body.size != null) {
            products.size = req.body.size;
        }

        const updatedProducts = await products.save(); // Save the updated product
        res.status(200).json(updatedProducts);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Menghapus produk berdasarkan ID
const deleteProducts = async (req, res) => {
    try {
        const products = await Products.findById(req.params.id);
        if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (products.foto) {
            fs.unlinkSync(path.join(__dirname, "../", products.foto));
        }

        await products.deleteOne();
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllProducts, getProductsById, createProducts, updateProducts, deleteProducts };
