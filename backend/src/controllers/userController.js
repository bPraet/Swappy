const User = require("../models/User");
const Role = require("../models/Role");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

module.exports = {
  getUserById(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { userId } = req.params;

        try {
          const user = await User.findById(userId);
          await user.populate("role").execPopulate();

          return res.json(user);
        } catch (error) {
          return res.status(400).json({
            message: "User does not exist, do you want to register instead ?",
          });
        }
      }
    });
  },

  addRole(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { name, description } = req.body;

        const role = await Role.create({
          name: name,
          description: description,
        });

        return res.json(role);
      }
    });
  },

  getProfile(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          const user = await User.findById(authData.user.userId);
          return res.json(user);
        } catch (error) {
          return res.status(400).json({
            message: "User does not exist",
          });
        }
      }
    });
  },

  updateProfile(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { email, password, lastName, firstName, pseudo, adress } =
          req.body;
        const user = await User.findById(authData.user.userId);
        const control = await userService.updateControl(
          password,
          email,
          pseudo,
          user
        );

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
                authData.user.userId
              )
              .then((response) => res.send(response));
          } catch (error) {
            return res.status(400).json({
              message: "User does not exist",
            });
          }
        } else {
          return res.send(control);
        }
      }
    });
  },
};
