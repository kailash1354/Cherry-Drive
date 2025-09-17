import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/register', (req, res) => {
    res.render('register'); // looks for views/register.ejs
});

router.post(
    '/register',
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 5 }),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: '❌ Invalid data',
            });
        }

        const { email, username, password } = req.body;

        const newUser = await User.create({
            email,
            username,
            password,
        });

        // For a better user experience, you could redirect to login after registering
        res.redirect('/user/login');
    }
);

router.get('/login', (req, res) => {
    res.render('login'); // looks for views/login.ejs
});

router.post(
    '/login',
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('password').trim().isLength({ min: 5 }),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array(),
                message: '❌ Invalid Data',
            });
        }

        const { email, password } = req.body;

        const userEmail = await User.findOne({ email: email });

        if (!userEmail) {
            return res.status(400).json({
                message: 'Email or Password is Incorrect',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            userEmail.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Email or Password is Incorrect',
            });
        }

        const token = jwt.sign(
            {
                userId: userEmail._id,
                email: userEmail.email,
                username: userEmail.username,
            },
            process.env.JWT_SECRET
        );

        // Set the token in an HTTP-Only cookie for better security
        res.cookie('token', token, { httpOnly: true, secure: false });

        // Redirect to the home page after a successful login
        res.redirect('/home');
    }
);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/user/login');
});

export default router;
