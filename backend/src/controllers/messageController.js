const Message = require("../models/Message");
const messageService = require("../services/messageService");
const jwt = require("jsonwebtoken");

module.exports = {
  addMessage(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { user, message, image } = req.body;

        if (!messageService.addControl(user, message, image)) {
          return res.json("Field missing");
        }

        const response = await Message.create({
          user1: authData.user.userId,
          user2: user,
          message: message,
          image: image,
        });

        return res.json(response);
      }
    });
  },

  getMessagesByUser(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { user } = req.params;
        try {
          messageService
            .getMessagesByUsers(authData.user.userId, user)
            .then((messages) => res.json(messages));
        } catch (error) {
          return res.status(400).json("Impossible de récupérer les messages");
        }
      }
    });
  },
};
