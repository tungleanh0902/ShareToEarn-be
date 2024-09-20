import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const commentSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.models.Comment || mongoose.model('Comment', commentSchema);