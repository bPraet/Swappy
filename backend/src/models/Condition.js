const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Condition', conditionSchema);