const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    images: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    condition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Condition"
    }
    //transport: String
});

module.exports = mongoose.model('Product', ProductSchema);