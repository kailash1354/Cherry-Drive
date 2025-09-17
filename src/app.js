import express from 'express';
//import dotenv from 'dotenv';
import morgan from 'morgan';
import userRouter from './routes/user.routes.js';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import cookieParser from 'cookie-parser';
import homeRouter from './routes/home.routes.js';
import fileRouter from './routes/file.routes.js';

// dotenv.config({
//     path: './.env',
// });

connectDB();
connectCloudinary();

const port = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// THIS LINE TO SERVES STATIC FILES
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
app.use('/user', userRouter);
app.use('/', homeRouter);
app.use('/file', fileRouter);

app.get('/', (req, res) => {
    res.redirect('/home');
});

// Start server
app.listen(port, () => {
    console.log(`✅ You are listening on http://localhost:${port}`);
});
