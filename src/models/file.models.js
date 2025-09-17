import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: true,
        },
        cloudinaryUrl: {
            type: String,
            required: true,
        },
        cloudinaryPublicId: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number, // size in bytes
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

export const File = mongoose.model('File', fileSchema);
