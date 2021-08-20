const Swap = require("../models/Swap");
const jwt = require("jsonwebtoken");
const swapService = require("../services/swapService");

module.exports = {
  addSwap(req, res) {
    const { owner, products, consignee } = req.body;

    if (!swapService.addControl(products, consignee, owner)) {
      return res.json("Champs requis manquant !");
    }

    try {
      swapService
        .add(consignee, products, owner)
        .then((swap) => res.json(swap));
    } catch (error) {
      return res.status(400).json("Impossible d'ajouter le swap");
    }
  },

  getSwapsByUser(req, res) {
    try {
      swapService
        .getByUser(req.loggedUser._id)
        .then((swaps) => res.json(swaps));
    } catch (error) {
      res.status(400).json("Impossible de récupérer les swaps");
    }
  },
};
