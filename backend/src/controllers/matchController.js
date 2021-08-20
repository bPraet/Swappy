const Match = require("../models/Match");
const jwt = require("jsonwebtoken");
const matchService = require("../services/matchService");

module.exports = {
  async addMatch(req, res) {
    const { productOwner, productConsignee, owner } = req.body;

    if (!matchService.addControl(productOwner, productConsignee, owner)) {
      return res.status(400).json("Champs requis manquant !");
    }
    try {
      matchService
        .addMatch(req.loggedUser._id, productOwner, owner, productConsignee)
        .then((match) => res.json(match));
    } catch (error) {
      res.status(400).json("Impossible d'ajouter le match");
    }
  },

  getMatchsByUser(req, res) {
    try {
      matchService
        .getMatchsByUser(req.loggedUser._id)
        .then((matchs) => res.json(matchs));
    } catch (error) {
      res
        .status(400)
        .json("Impossible de récupérer les matchs de l'utilisateur");
    }
  },

  getPropositionsByUser(req, res) {
    try {
      matchService
        .getPropositionsByUser(req.loggedUser._id)
        .then((propositions) => res.json(propositions));
    } catch (error) {
      res
        .status(400)
        .json("Impossible de récupérer les propositions de l'utilisateur");
    }
  },

  getMatchDetails(req, res) {
    const { owner, consignee, productId } = req.params;

    try {
      matchService
        .getMatchDetails(owner, consignee, productId)
        .then((match) => res.json(match));
    } catch (error) {
      res.status(400).json("Impossible de récupérer les détails du produit");
    }
  },

  delMatchById(req, res) {
    const { matchId } = req.params;

    try {
      matchService.delMatchById(matchId).then((response) => res.json(response));
    } catch (err) {
      return res.status(400).json("Impossible de supprimer le match");
    }
  },

  delMatchesByProductId(req, res) {
    const { productId } = req.params;

    try {
      matchService
        .delMatchesByProductId(productId)
        .then((response) => res.json(response));
    } catch (error) {
      return res.status(400).json("Impossible de supprimer les matchs");
    }
  },

  delMatchesByProductIdAndConsignee(req, res) {
    const { productId, consigneeId } = req.params;

    try {
      matchService
        .delMatchesByProductIdAndConsignee(productId, consigneeId)
        .then((response) => res.json(response));
    } catch (error) {
      return res.status(400).json("Impossible de supprimer les matchs");
    }
  },
};
