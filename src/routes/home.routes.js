import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { File } from '../models/file.models.js';

const router = Router();

router.get('/home', verifyJWT, async (req, res) => {
    try {
        const files = await File.find({ owner: req.user._id }).sort({
            createdAt: -1,
        });

        res.render('home', { files: files, user: req.user });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.render('home', { files: [], user: req.user });
    }
});

export default router;
