const trackingService = require("../services/trackingService");

module.exports = {
  addAlreadySeen(req, res) {
    const { productId } = req.body;

    try {
      trackingService
        .add(req.loggedUser._id, productId)
        .then((alreadySeen) => res.json(alreadySeen));
    } catch (error) {
      return res.status(400).json("Impossible de l'ajouter dans l'historique");
    }
  },

  resetAlreadySeen(req, res) {
    try {
      trackingService.reset(req.loggedUser._id).then(alreadySeen => res.json(alreadySeen));
    } catch (error) {
      return res.status(400).json("Impossible de supprimer l'historique");
    }
  },
};
