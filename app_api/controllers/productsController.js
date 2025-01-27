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
    const products = new Products({
        nama: req.body.nama,
        deskripsi: req.body.deskripsi,
        harga: req.body.harga,
        kategori: req.body.kategori,
        foto: req.file ? req.file.path: null,
    });

    try {
        const newProducts = await products.save();
        res.status(201).json(newProducts);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Memperbarui data produk berdasarkan ID
const updateProducts = async (req, res) => {
    try {
        const products = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (req.file){
            //jika ada file foto baru
            if(products.foto){
                // hapus foto lama jika ada
                fs.unlinkSync(path.join(__dirname, "../", products.foto))
            }
            products.foto = req.file.path;

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

        const updatedProducts = await products.save();
        res.status(200).json(updatedProducs);
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
        if (products.foto){
            fs.unlinkSync(path.join(__dirname, "../", products.foto));
        }

        await products.deleteOne();
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllProducts, getProductsById, createProducts, updateProducts, deleteProducts };
