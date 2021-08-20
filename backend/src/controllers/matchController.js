const Match = require("../models/Match");
const jwt = require("jsonwebtoken");
const matchService = require("../services/matchService");

module.exports = {
  addMatch(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { productOwner, productConsignee, owner } = req.body;

        if (!matchService.addControl(productOwner, productConsignee, owner)) {
          return res.status(400).json("Field missing");
        }

        const match = await Match.create({
          consignee: authData.user.userId,
          productOwner: productOwner,
          owner: owner,
          productConsignee: productConsignee,
        });

        return res.json(match);
      }
    });
  },

  getMatchsByUser(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          matchService
            .getMatchsByUser(authData.user.userId)
            .then((matchs) => res.json(matchs));
        } catch (error) {
          res
            .status(400)
            .json("Impossible de récupérer les matchs de l'utilisateur");
        }
      }
    });
  },

  getPropositionsByUser(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          matchService
            .getPropositionsByUser(authData.user.userId)
            .then((propositions) => res.json(propositions));
        } catch (error) {
          res
            .status(400)
            .json("Impossible de récupérer les propositions de l'utilisateur");
        }
      }
    });
  },

  getMatchDetails(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { owner, consignee, productId } = req.params;
        try {
          const matchs = await Match.find().and([
            { owner: owner, consignee: consignee, productOwner: productId },
          ]);

          return res.json(matchs);
        } catch (error) {
          res
            .status(400)
            .json("Impossible de récupérer les détails du produit");
        }
      }
    });
  },

  delMatchById(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { matchId } = req.params;

        try {
          await Match.findByIdAndDelete(matchId);
        } catch (err) {
          return res.status(400).json("Match not found");
        }
      }
    });
  },

  delMatchesByProductId(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { productId } = req.params;
        try {
          await Match.deleteMany({ productOwner: productId });
          await Match.deleteMany({ productConsignee: productId });
          return res.send("Successfully deleted");
        } catch (error) {
          return res.status(400).json("No match found");
        }
      }
    });
  },

  delMatchesByProductIdAndConsignee(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { productId, consigneeId } = req.params;
        try {
          await Match.deleteMany({
            productOwner: productId,
            consignee: consigneeId,
          });

          return res.json({ message: "Successfully deleted" });
        } catch (error) {
          return res.status(400).json({
            message: "No match found",
          });
        }
      }
    });
  },
};
