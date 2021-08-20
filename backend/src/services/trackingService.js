const AlreadySeen = require("../models/AlreadySeen");

module.exports = {
  async add(userId, productId) {
    const alreadySeen = await AlreadySeen.create({
      user: userId,
      product: productId,
    });

    return alreadySeen;
  },

  async reset(userId) {
    await AlreadySeen.deleteMany({ user: userId });

    return "Historique reset avec succès";
  },
};
