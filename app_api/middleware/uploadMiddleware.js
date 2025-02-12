const { v2: cloudinary } = require('cloudinary');

// Configuration for Cloudinary
cloudinary.config({ 
    cloud_name: 'dvllzlypd', 
    api_key: '275885613478582', 
    api_secret: '<your_api_secret>' // Replace with your actual API secret
});

// Middleware to handle image uploads to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        req.file.cloudinaryUrl = result.secure_url; // Store the Cloudinary URL in the request
        next();
    } catch (error) {
        console.error('Cloudinary upload error:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Error uploading to Cloudinary', error });
    }
};

module.exports = uploadToCloudinary;
