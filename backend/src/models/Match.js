const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  consignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productConsignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = mongoose.model("Match", MatchSchema);
