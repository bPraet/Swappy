const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Transport', transportSchema);