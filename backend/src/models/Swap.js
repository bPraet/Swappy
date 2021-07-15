const mongoose = require('mongoose');

const SwapSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: Array,
    consignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Swap', SwapSchema);