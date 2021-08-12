const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: String,
    image: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);