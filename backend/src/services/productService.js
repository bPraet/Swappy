const AlreadySeen = require("../models/AlreadySeen");
const Match = require("../models/Match");
const Product = require("../models/Product");
const fs = require("fs");

module.exports = {
  async getNotSeen(userId) {
    const alreadySeenProducts = await AlreadySeen.find({ user: userId });
    const matchedProducts = await Match.find().or([
      { owner: userId },
      { consignee: userId },
    ]);
    const toRemoveSeen = alreadySeenProducts.map((seenProduct) => {
      return { _id: seenProduct.product };
    });
    const toRemoveMatch = matchedProducts.map((matchedProducts) => {
      return { _id: matchedProducts.productOwner };
    });
    const products = await Product.find({
      $and: [
        { _id: { $nin: toRemoveSeen } },
        { _id: { $nin: toRemoveMatch } },
        { user: { $nin: userId } },
      ],
    })
      .sort({ _id: -1 })
      .limit(3);

    return products;
  },

  async getByUserId(userId) {
    const products = await Product.find({ user: userId });

    return products;
  },

  async getDetails(id) {
    const product = await Product.findById(id)
      .populate("user", "-password")
      .populate("condition")
      .populate("transport");

    return product;
  },

  async getAll() {
    const products = await Product.find({});

    return products;
  },

  addControl(name, description, conditionId, transportId, image) {
    if (!name || !description || !conditionId || !transportId)
      return "Champs requis manquant !";

    if (name === "undefined" || description === "undefined")
      return "Champs requis manquant !";

    if (name.length > 50) return "Nom de maximum 50 caractères !";

    if (description.length > 1500)
      return "Description de maximum 1500 caractères !";

    if (!image)
      return "Veuillez uploader une image de 5Mo ou moins s'il vous plait ! (.jpg, .jpeg)";

    return false;
  },

  async add(name, description, userId, image, conditionId, transportId) {
    const product = await Product.create({
      name: name,
      description: description,
      user: userId,
      image: image,
      condition: conditionId,
      transport: transportId,
    });

    return product;
  },

  updateControl(product, userId, name, description, conditionId, transportId) {
    if (!product) return "Le produit n'existe pas !";

    if (userId.toString() !== product.user._id.toString())
      return "Tu ne possèdes pas ce produit !";

    if (!name || !description || !conditionId || !transportId)
      return "Champs requis manquant !";

    if (name === "undefined" || description === "undefined")
      return "Champs requis manquant !";

    if (name.length > 50) return "Nom de maximum 50 caractères !";

    if (description.length > 1500)
      return "Description de maximum 1500 caractères !";

    return false;
  },

  updateImage(image, product) {
    if (!image) image = product.image;
    else {
      image = image.filename;
      fs.unlink(`./files/${product.image}`, () => {});
    }

    return image;
  },

  async update(productId, name, description, image, conditionId, transportId) {
    await Product.findByIdAndUpdate(
      productId,
      {
        name: name,
        description: description,
        image: image,
        condition: conditionId,
        transport: transportId,
      },
      { useFindAndModify: false }
    );
  },

  async delete(productId, userId) {
    let product;

    try {
      product = await Product.findById(productId);
    } catch (err) {
      return "Ce produit n'existe pas";
    }

    if (!product) return "Ce produit n'existe pas";

    if (userId.toString() !== product.user._id.toString())
      return "Tu ne possèdes pas ce produit !";

    try {
      await Product.findByIdAndDelete(productId);
    } catch (err) {
      return "Ce produit n'existe pas";
    }

    try {
      fs.unlink(`./files/${product.image}`, () => {});
    } catch (err) {
      return "Aucune image a supprimer";
    }

    return "Supprimé avec succès";
  },
};
