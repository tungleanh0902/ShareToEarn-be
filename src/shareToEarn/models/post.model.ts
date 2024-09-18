import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timeout: {
        type: Number,
        required: true,
    },
    isRewarded: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);