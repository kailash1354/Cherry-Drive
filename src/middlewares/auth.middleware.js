import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            // Redirect to login if no token is found
            return res.redirect('/user/login');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken?.userId).select(
            '-password'
        );

        if (!user) {
            // Clear the invalid cookie and redirect to login
            res.clearCookie('token');
            return res.redirect('/user/login');
        }

        req.user = user;
        next();
    } catch (error) {
        // Any other error (like an expired token), clear the cookie and redirect
        console.error('Authentication error:', error.message);
        res.clearCookie('token');
        return res.redirect('/user/login');
    }
};
