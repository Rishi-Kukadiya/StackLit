import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            // console.log("No file path provided");
            return null;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // console.log("File uploaded to Cloudinary:", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        // console.log("Error uploading file to Cloudinary:", error);
        return null;
    }
}

const deleteImageFromCloudinary = async (secureUrl) => {
    if (!secureUrl) return;

    try {
        // This more robustly extracts the public_id, handling folders correctly.
        const urlParts = secureUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) {
            console.error(`Invalid Cloudinary URL, 'upload' not found: ${secureUrl}`);
            return;
        }
        const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));

        if (!publicId) {
            console.error(`Could not extract public_id from URL: ${secureUrl}`);
            return;
        }

        // Use `destroy` with resource_type specified to avoid ambiguity
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });

        if (result.result === 'ok') {
            // console.log(`Successfully deleted asset with public_id: ${publicId}`);
        } else {
            console.warn(`Cloudinary deletion failed for public_id ${publicId}:`, result.result);
        }
    } catch (error) {
        console.error(`Error deleting asset from Cloudinary:`, error);
    }
};

export default uploadOnCloudinary;
export { cloudinary, deleteImageFromCloudinary };