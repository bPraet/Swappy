const User = require("../models/User");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const roleService = require("../services/roleService");

module.exports = {
  getUserById(req, res) {
    const { userId } = req.params;

    try {
      userService.getById(userId).then((user) => res.json(user));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer l'utilisateur");
    }
  },

  addRole(req, res) {
    const { name, description } = req.body;

    try {
      roleService.add(name, description);
    } catch (error) {
      return res.status(400).json("Impossible d'ajouter le rôle");
    }
  },

  getProfile(req, res) {
    try {
      userService.getProfile(req.loggedUser._id).then((user) => res.json(user));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer le profil");
    }
  },

  updateProfile(req, res) {
    const { email, password, lastName, firstName, pseudo, adress } = req.body;

    userService
      .updateControl(password, email, pseudo, req.loggedUser)
      .then((control) => {
        if (control === true) {
          try {
            userService
              .updateProfile(
                email,
                password,
                lastName,
                firstName,
                pseudo,
                adress,
                req.loggedUser._id
              )
              .then((response) => res.send(response));
          } catch (error) {
            return res.status(400).json({
              message: "Impossible de mettre à jour le profil",
            });
          }
        } else {
          return res.status(400).json(control);
        }
      });
  },
};
