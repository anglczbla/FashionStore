const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
    orders_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        required: false,
    },
    pesan: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, {

});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;