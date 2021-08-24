const User = require("../models/User");
const Product = require("../models/Product");
const Match = require("../models/Match");
const mongoose = require("mongoose");

module.exports = {
  addControl(productOwner, productConsignee, owner) {
    if (!productOwner || !productConsignee || !owner) {
      return false;
    }
    return true;
  },

  async add(userId, productOwner, owner, productConsignee){
    const match = await Match.create({
      consignee: userId,
      productOwner: productOwner,
      owner: owner,
      productConsignee: productConsignee,
    });

    return match;
  },

  async getMatchsByUser(userId) {
    let results = await Match.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { consignee: "$consignee", productOwner: "$productOwner" },
        },
      },
    ]).sort("field _id");

    results = results.map((result) => {
      result.consignee = result._id.consignee;
      result.productOwner = result._id.productOwner;
      delete result._id;
      return result;
    });

    const matchsConsignee = await User.populate(results, { path: "consignee" });
    const matchs = await Product.populate(matchsConsignee, {
      path: "productOwner",
    });

    return matchs;
  },

  async getPropositionsByUser(userId) {
    let results = await Match.aggregate([
      { $match: { consignee: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: { owner: "$owner", productOwner: "$productOwner" } } },
    ]).sort("field _id");

    results = results.map((result) => {
      result.owner = result._id.owner;
      result.productOwner = result._id.productOwner;
      delete result._id;
      return result;
    });

    const matchsOwner = await User.populate(results, { path: "owner" });
    const propositions = await Product.populate(matchsOwner, {
      path: "productOwner",
    });

    return propositions;
  },

  async getDetails(owner, consignee, productId) {
    const matchs = await Match.find().and([
      { owner: owner, consignee: consignee, productOwner: productId },
    ]);

    return matchs;
  },

  async delById(matchId) {
    await Match.findByIdAndDelete(matchId);

    return "Supprimé avec succès !";
  },

  async delByProductId(productId) {
    await Match.deleteMany({ productOwner: productId });
    await Match.deleteMany({ productConsignee: productId });

    return "Supprimés avec succès !";
  },

  async delByProductIdAndConsignee(productId, consigneeId) {
    await Match.deleteMany({
      productOwner: productId,
      consignee: consigneeId,
    });

    return "Supprimés avec succès !";
  },
};
