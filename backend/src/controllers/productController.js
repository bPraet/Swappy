const Condition = require("../models/Condition");
const Product = require("../models/Product");
const Transport = require("../models/Transport");
const productService = require("../services/productService");
const jwt = require("jsonwebtoken");
const conditionService = require("../services/conditionService");
const transportService = require("../services/transportService");

module.exports = {
  addProduct(req, res) {
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
    try {
      productService
        .add(
          name,
          description,
          req.loggedUser._id,
          image,
          conditionId,
          transportId
        )
        .then((product) => res.json(product));
    } catch (error) {
      res.status(400).json("Impossible d'ajouter le produit");
    }
  },

  getProductById(req, res) {
    const { productId } = req.params;

    try {
      productService.getDetails(productId).then((product) => res.json(product));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer le produit");
    }
  },

  getProductsByUserId(req, res) {
    try {
      productService
        .getProductsByUserId(req.loggedUser._id)
        .then((products) => res.json(products));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer les produits");
    }
  },

  getNotSeenProductsByUserId(req, res) {
    try {
      productService
        .getNotSeenProducts(req.loggedUser._id)
        .then((products) => res.json(products));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer les produits");
    }
  },

  getProducts(req, res) {
    try {
      productService.getAll().then((products) => res.json(products));
    } catch (error) {
      return res.status(400).json({
        message: "Impossible de récupérer les produits",
      });
    }
  },

  updateProduct(req, res) {
    const { name, description, conditionId, transportId } = req.body;
    const { productId } = req.params;
    let image = req.file;
    productService.getDetails(productId).then((product) => {
      if (
        (message = productService.updateControl(
          product,
          req.loggedUser._id,
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
        productService
          .update(productId, name, description, image, conditionId, transportId)
          .then(res.json("Produit mis à jour avec succès"));
      } catch (error) {
        return res.status(400).json("Impossible de mettre le produit à jour");
      }
    });
  },

  delProduct(req, res) {
    const { productId } = req.params;

    try {
      productService
        .delete(productId, req.loggedUser._id)
        .then((response) => res.send(response));
    } catch (error) {
      return res.status(400).json("Impossible de supprimer le produit");
    }
  },

  addCondition(req, res) {
    const { name, description } = req.body;

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

    try {
      transportService
        .add(name, description)
        .then((transport) => res.json(transport));
    } catch (error) {
      return res.status(400).json("Impossible d'ajouter le transport");
    }
  },

  getConditions(req, res) {
    try {
      conditionService.getAll().then((conditions) => res.json(conditions));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer les conditions");
    }
  },

  getConditionById(req, res) {
    const { conditionId } = req.params;

    try {
      conditionService
        .getById(conditionId)
        .then((condition) => res.json(condition));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer la condition");
    }
  },

  getTransports(req, res) {
    try {
      transportService.getAll().then((transports) => res.json(transports));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer les transports");
    }
  },

  getTransportById(req, res) {
    const { transportId } = req.params;

    try {
      transportService
        .getById(transportId)
        .then((transport) => res.json(transport));
    } catch (error) {
      return res.status(400).json("Impossible de récupérer le transport");
    }
  },
};
