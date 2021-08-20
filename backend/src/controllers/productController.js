const Condition = require("../models/Condition");
const Product = require("../models/Product");
const Transport = require("../models/Transport");
const productService = require("../services/productService");
const jwt = require("jsonwebtoken");

module.exports = {
  addProduct(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { name, description, conditionId, transportId } = req.body;

        if (
          (message = productService.addControl(
            name,
            description,
            conditionId,
            transportId,
            req.file
          ))
        ) {
          return res.status(400).json(message);
        }

        const image = req.file.filename;
        const product = await Product.create({
          name: name,
          description: description,
          user: authData.user.userId,
          image: image,
          condition: conditionId,
          transport: transportId,
        });

        return res.json(product);
      }
    });
  },

  getProductById(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { productId } = req.params;

        try {
          const product = await productService.getDetails(productId);

          return res.json(product);
        } catch (error) {
          return res.status(400).json({
            message: "Product does not exist",
          });
        }
      }
    });
  },

  getProductsByUserId(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          const products = await Product.find({ user: authData.user.userId });
          return res.json(products);
        } catch (error) {
          return res.status(400).json({
            message: "No products yet",
          });
        }
      }
    });
  },

  getNotSeenProductsByUserId(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          const products = await productService.getNotSeenProducts(
            authData.user.userId
          );
          return res.json(products);
        } catch (error) {
          return res.status(400).json({
            message: "No products yet",
          });
        }
      }
    });
  },

  getProducts(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          const products = await Product.find({});

          return res.json(products);
        } catch (error) {
          return res.status(400).json({
            message: "No products yet",
          });
        }
      }
    });
  },

  updateProduct(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { name, description, conditionId, transportId } = req.body;
        const { productId } = req.params;
        const product = await Product.findById(productId);
        let image = req.file;

        if (
          (message = productService.updateControl(
            product,
            authData.user.userId,
            name,
            description,
            conditionId,
            transportId
          ))
        ) {
          return res.status(400).json(message);
        }

        image = productService.updateImage(image, product);

        try {
          await Product.findByIdAndUpdate(
            productId,
            {
              name: name,
              description: description,
              image: image,
              condition: conditionId,
              transport: transportId,
            },
            { useFindAndModify: false }
          );
          return res.json("Produit mis à jour avec succès");
        } catch (error) {
          return res.status(400).json("Le produit n'existe pas");
        }
      }
    });
  },

  delProduct(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { productId } = req.params;

        productService
          .delete(productId, authData.user.userId)
          .then((response) => res.send(response));
      }
    });
  },

  addCondition(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { name, description } = req.body;

        const condition = await Condition.create({
          name: name,
          description: description,
        });

        return res.json(condition);
      }
    });
  },

  addTransport(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { name, description } = req.body;

        const transport = await Transport.create({
          name: name,
          description: description,
        });

        return res.json(transport);
      }
    });
  },

  getConditions(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          const conditions = await Condition.find({});

          return res.json(conditions);
        } catch (error) {
          return res.status(400).json({
            message: "No conditions yet",
          });
        }
      }
    });
  },

  getConditionById(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { conditionId } = req.params;

        try {
          const condition = await Condition.findById(conditionId);
          return res.json(condition);
        } catch (error) {
          return res.status(400).json({
            message: "Condition does not exist",
          });
        }
      }
    });
  },

  getTransports(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          const transports = await Transport.find({});

          return res.json(transports);
        } catch (error) {
          return res.status(400).json({
            message: "No transports yet",
          });
        }
      }
    });
  },

  getTransportById(req, res) {
    jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { transportId } = req.params;

        try {
          const transport = await Transport.findById(transportId);
          return res.json(transport);
        } catch (error) {
          return res.status(400).json({
            message: "Transport does not exist",
          });
        }
      }
    });
  },
};
