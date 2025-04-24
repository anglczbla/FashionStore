const mongoose = require("mongoose");

const stokSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
    },
    jumlah: {
        type: Number,
        required: true,
        default: 0
    }

}, { timestamps: true });

const stok = mongoose.model("stok", stokSchema);
module.exports = stok;