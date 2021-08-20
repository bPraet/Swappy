const Swap = require("../models/Swap");

module.exports = {
  addControl(products, consignee, owner) {
    if (!products || !consignee || !owner) {
      return false;
    }
    return true;
  },

  async add(consignee, products, owner) {
    const swap = await Swap.create({
      consignee: consignee,
      products: products,
      owner: owner,
    });

    return swap;
  },

  async getByUser(userId) {
    const swaps = await Swap.find()
      .or([{ owner: userId }, { consignee: userId }])
      .populate("owner")
      .populate("consignee");

    return swaps;
  },
};
