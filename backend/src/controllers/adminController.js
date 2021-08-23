const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const adminService = require("../services/adminService");

module.exports = {
  getUsers(req, res) {
    if (!adminService.adminControl(req.loggedUser.role)) {
      res.sendStatus(403);
      return;
    }

    try {
      adminService.getUsers().then((users) => res.json(users));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer les utilisateurs");
    }
  },

  deleteUser(req, res) {
    const { userId } = req.params;

    if (!adminService.adminControl(req.loggedUser.role)) {
      res.sendStatus(403);
      return;
    }

    try {
      adminService.deleteUser(userId);

      return res.send("User deleted");
    } catch (err) {
      return res.status(400).json("Impossible de supprimer l'utilisateur");
    }
  },

  getProducts(req, res) {
    const { userId } = req.params;

    if (!adminService.adminControl(req.loggedUser.role)) {
      res.sendStatus(403);
      return;
    }

    try {
      adminService.getProducts(userId).then((products) => res.json(products));
    } catch (error) {
      return res.status(400).json({
        message: "Impossible de récupérer les produits",
      });
    }
  },

  sendEmail(req, res) {
    const { email, message } = req.body;

    if (!adminService.adminControl(req.loggedUser.role)) {
      res.sendStatus(403);
      return;
    }

    if (!adminService.mailControl(email, message)) {
      return res.json("Veuillez écrire quelque chose dans le mail à envoyer");
    }

    if (adminService.sendEmail(email, message)) {
      return res.send("Email envoyé avec succès !");
    }

    res.send(
      "Impossible d'envoyer le mail pour le moment... Veuillez réessayer plus tard !"
    );
  },

  isAdmin(req, res) {
    if (adminService.adminControl(req.loggedUser.role)) res.send(true);
    else res.send(false);
  },

  addCondition(req, res) {
    const { name, description } = req.body;

    if (!adminService.adminControl(req.loggedUser.role)) {
      res.sendStatus(403);
      return;
    }
    try {
      conditionService
        .add(name, description)
        .then((condition) => res.json(condition));
    } catch (error) {
      return res.status(400).json("Impossible d'ajouter la condition");
    }
  },

  addTransport(req, res) {
    const { name, description } = req.body;

    if (!adminService.adminControl(req.loggedUser.role)) {
      res.sendStatus(403);
      return;
    }
    try {
      transportService
        .add(name, description)
        .then((transport) => res.json(transport));
    } catch (error) {
      return res.status(400).json("Impossible d'ajouter le transport");
    }
  },
};
