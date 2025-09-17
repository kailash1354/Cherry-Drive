import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { File } from '../models/file.models.js';

const router = Router();

// Configure Multer Storage (this is now much simpler)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'My-Cherry-Drive',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'mp4'],
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB limit
});

// ROUTE TO UPLOAD A FILE
router.post('/upload', verifyJWT, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.redirect('/home?error=No file was selected for upload.');
        }
        await File.create({
            originalName: req.file.originalname,
            cloudinaryUrl: req.file.path,
            cloudinaryPublicId: req.file.filename,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            owner: req.user._id,
        });
        res.redirect('/home?success=File uploaded successfully!');
    } catch (error) {
        console.error('Upload Error:', error);
        res.redirect('/home?error=An error occurred during file upload.');
    }
});

// ROUTE TO DELETE A FILE
router.post('/delete/:id', verifyJWT, async (req, res) => {
    try {
        const fileId = req.params.id;
        const userId = req.user._id;
        const file = await File.findById(fileId);
        if (!file) {
            return res.redirect('/home?error=File not found.');
        }
        if (file.owner.toString() !== userId.toString()) {
            return res.redirect(
                '/home?error=Unauthorized to delete this file.'
            );
        }
        // This will now work because Cloudinary is configured globally
        await cloudinary.uploader.destroy(file.cloudinaryPublicId);
        await File.findByIdAndDelete(fileId);
        res.redirect('/home?success=File deleted successfully!');
    } catch (error) {
        console.error('Error deleting file:', error);
        res.redirect('/home?error=An error occurred while deleting the file.');
    }
});

export default router;
