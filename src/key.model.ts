import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const keySchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    },
    key: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.models.Key || mongoose.model('Key', keySchema);