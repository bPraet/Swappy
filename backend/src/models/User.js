const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String,
    email: String,
    pseudo: String,
    phone: String,
    adress: String,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    }
});

module.exports = mongoose.model('User', UserSchema);