const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const adminService = require("../services/adminService");

module.exports = {
  getUsers(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (!adminService.adminControl(authData.user.role)) {
          res.sendStatus(403);
          return;
        }

        try {
          const user = await User.find({});

          return res.json(user);
        } catch (error) {
          return res.status(400).json({
            message: "No users",
          });
        }
      }
    });
  },

  deleteUser(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { userId } = req.params;

        if (!adminService.adminControl(authData.user.role)) {
          res.sendStatus(403);
          return;
        }

        try {
          adminService.deleteUser(userId);

          return res.send("User deleted");
        } catch (err) {
          return res
            .status(400)
            .json("Can't delete this user for the moment, try again later...");
        }
      }
    });
  },

  getProducts(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { userId } = req.params;

        if (!adminService.adminControl(authData.user.role)) {
          res.sendStatus(403);
          return;
        }

        try {
          const products = await Product.find({ user: userId })
            .populate("transport")
            .populate("condition");

          return res.json(products);
        } catch (error) {
          return res.status(400).json({
            message: "User does not exist",
          });
        }
      }
    });
  },

  sendEmail(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { email, message } = req.body;

        if (!adminService.adminControl(authData.user.role)) {
          res.sendStatus(403);
          return;
        }

        if (!adminService.mailControl(email, message)) {
          return res.json("Field missing");
        }

        if (adminService.sendEmail(email, message)) {
          return res.send("Email envoyé avec succès !");
        }

        res.send(
          "Impossible d'envoyer le mail pour le moment... Veuillez réessayer plus tard !"
        );
      }
    });
  },

  isAdmin(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (adminService.adminControl(authData.user.role)) res.send(true);
        else res.send(false);
      }
    });
  },
};
