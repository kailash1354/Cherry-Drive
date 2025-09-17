import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' }); // Ensure env variables are loaded

const connectCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log('✅ Cloudinary Connected Successfully!!');
    } catch (error) {
        console.error('❌ Cloudinary Connection Failed!!', error);
    }
};

export default connectCloudinary;
