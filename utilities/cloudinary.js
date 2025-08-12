const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY ,
  api_secret: process.env.CLOUDINARY_API_SECRET  
});

// Set up Multer storage (temporary folder)
const upload = multer({ dest: 'uploads/' });

/**
* Upload file to Cloudinary
* @param {string} filePath - Path of the uploaded file
* @returns {Promise<string>} - Cloudinary URL
*/
const uploadToCloudinary = async (filePath) => {
  try {
      const result = await cloudinary.uploader.upload(filePath, { 
        folder: "products",
        fetch_format: "auto",  // Auto-adjust format
        quality: "auto",       // Auto-adjust quality
        crop: "auto",          // Auto-crop
        gravity: "auto",
        width: 500,
        height: 500
       });
      fs.unlinkSync(filePath); // Delete temp file
      return result.secure_url;
  } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null; // Return null instead of throwing error
  }
};


const addImages = async (existingImages, files) => {
  const uploadedImages = [];

  for (const file of files) {
    const imageUrl = await uploadToCloudinary(file.path);
    if (imageUrl) {
      uploadedImages.push(imageUrl);
    }
  }

  return [...existingImages, ...uploadedImages];
};
/**
 * Remove specified images from Cloudinary and return updated image list
 * @param {string[]} existingImages - All current image URLs
 * @param {string[]} imagesToRemove - URLs to remove
 * @returns {Promise<{ updatedImages: string[], errors: string[] }>}
 */
const removeImages = async (existingImages, imagesToRemove) => {
  const updatedImages = [];
  const errors = [];

  for (const img of existingImages) {
    if (imagesToRemove.includes(img)) {
      const publicId = extractCloudinaryPublicId(img);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (error) {
          console.error("Cloudinary Deletion Error:", error);
          errors.push(`Failed to delete: ${img}`);
        }
      } else {
        errors.push(`Invalid Cloudinary URL: ${img}`);
      }
    } else {
      updatedImages.push(img); // keep image
    }
  }

  return { updatedImages, errors };
};
const extractCloudinaryPublicId = (url) => {
  if (!url) return null;

  try {
    const cleanUrl = url.split("?")[0];
    const parts = cleanUrl.split("/upload/");
    if (parts.length < 2) return null;

    const publicIdWithExtension = parts[1];
    const publicId = publicIdWithExtension.split(".").slice(0, -1).join(".");
    return publicId;
  } catch (error) {
    console.error("Failed to extract publicId:", error);
    return null;
  }
};


module.exports = {
  upload,
  uploadToCloudinary,
  addImages,
  removeImages,
  extractCloudinaryPublicId,
};
