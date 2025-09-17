import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [5, 'Username must be 5 characters long'],
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [13, 'Email must be atleast 13 characters long'],
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'Password must be atleast 5 characters long'],
    },
});

// hashing the password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// comparing the hashed password with the normal one
// userSchema.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password);
// };

export const User = mongoose.model('User', userSchema);
