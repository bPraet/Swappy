const messageService = require("../services/messageService");
const jwt = require("jsonwebtoken");

module.exports = {
  addMessage(req, res) {
    const { user, message, image } = req.body;

    if (!messageService.addControl(user, message, image)) {
      return res.json("Field missing");
    }

    try {
      messageService
        .addMessage(req.loggedUser._id, user, message, image)
        .then((response) => res.json(response));
    } catch (error) {
      return res.status(400).json("Impossible d'ajouter le message");
    }
  },

  getMessagesByUser(req, res) {
    const { user } = req.params;

    try {
      messageService
        .getMessagesByUsers(req.loggedUser._id, user)
        .then((messages) => res.json(messages));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer les messages");
    }
  },
};
