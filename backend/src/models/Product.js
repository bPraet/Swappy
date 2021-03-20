const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    condition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Condition"
    },
    transport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transport"
    }
});

module.exports = mongoose.model('Product', ProductSchema);