const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


// ENV SAFETY CHECK
if (
  !process.env.CLOUD_NAME ||
  !process.env.CLOUD_API_KEY ||
  !process.env.CLOUD_API_SECRET
) {
  throw new Error("Cloudinary environment variables not set");
}

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// STORAGE CONFIG
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:
      process.env.NODE_ENV === "production"
        ? "WanderLust_PROD"
        : "WanderLust_DEV",

    allowed_formats: ["jpg", "jpeg", "png"],

    transformation: [
      { width: 1200, height: 800, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  },
});

// MULTER CONFIG
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

module.exports = { cloudinary, storage, upload };
