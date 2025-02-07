const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://aulianisafitri434:mongodbfitri44@cluster0.caeph.mongodb.net/fashionstore?retryWrites=true&w=majority&appName=Cluster0" 
            //"mongodb://localhost:27017/mdpdb"
        );
        console.log("mongoDB Connected...");
    } catch (error){
        console.error("MongoDB connection error:", error);

        process.exit(1);
    }
    };

    module.exports = connectDB;