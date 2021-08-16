const Condition = require('../models/Condition');
const Product = require('../models/Product');
const Transport = require('../models/Transport');
const User = require('../models/User');
const productService = require('../services/productService');

const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
    addProduct(req, res) {
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            }
            else {
                const { name, description, conditionId, transportId } = req.body;
 
                if(!productService.addControl(name, description, conditionId, transportId, req.file)){
                    return res.status(400).json('Missing field');
                }

                const image = req.file.filename;
                const product = await Product.create({
                    name: name,
                    description: description,
                    user: authData.user.userId,
                    image: image,
                    condition: conditionId,
                    transport: transportId
                });

                return res.json(product);
            }
        });
    },
    
    getProductById(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { productId } = req.params;

                try {
                    const product = await productService.getDetails(productId);
        
                    return res.json(product);
                } catch (error) {
                    return res.status(400).json({
                        message: 'Product does not exist'
                    });
                }
            }
        });
    },

    getProductsByUserId(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    const products = await Product.find({user: authData.user.userId});
                    return res.json(products);
                } catch (error) {
                    return res.status(400).json({
                        message: 'No products yet'
                    });
                }
            }
        });
    },

    getNotSeenProductsByUserId(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    const products = await productService.getNotSeenProducts(authData.user.userId);
                    return res.json(products);
                } catch (error) {
                    return res.status(400).json({
                        message: 'No products yet'
                    });
                }
            }
        });
    },

    getProducts(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    const products = await Product.find({});
        
                    return res.json(products);
                } catch (error) {
                    return res.status(400).json({
                        message: 'No products yet'
                    });
                }
            }
        });
    },

    updateProduct(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { name, description, conditionId, transportId } = req.body;
                const { productId } = req.params;
                let image = '';
                const product = await Product.findById(productId);

                if(!product)
                    return res.status(400).json("Product does not exist");

                if(authData.user.userId != product.user)
                    return res.status(400).json("You don't own this product !");

                if(!productService.updateControl(name, description, conditionId, transportId)){
                    return res.status(400).json("Missing field");
                }
                
                if(req.file === undefined)
                    image = product.image;
                else {
                    image = req.file.filename;
                    fs.unlink(`./files/${product.image}`, (result) => {
                        console.log("Image deleted");
                    });
                }
        
                try {
                    await Product.findByIdAndUpdate(productId, {
                        name: name,
                        description: description,
                        image: image,
                        condition: conditionId,
                        transport: transportId
                    }, {useFindAndModify: false});
                    return res.json({message: "Successfully updated"});
                } catch (error) {
                    return res.status(400).json({
                        message: 'Product does not exist'
                    })
                }
            }
        });
    },

    delProduct(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { productId } = req.params;

                let product;
                try{
                    product = await Product.findById(productId);
                } catch(err){
                    return res.json('Nothing to delete');
                }
                
                try{
                    await Product.findByIdAndDelete(productId);
                } catch(err){
                    return res.status(400).json("Product not found");
                }

                try{
                    fs.unlink(`./files/${product.image}`, (result) => {
                        console.log("Image deleted");
                    });
                } catch(err){
                    return res.status(400).json("No image to delete");
                }
                

                return res.json({message: "Successfully deleted"});
            }
        });
    },

    addCondition(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { name, description } = req.body;

                const condition = await Condition.create({
                    name: name,
                    description: description
                })
        
                return res.json(condition);
            }
        });
    },

    addTransport(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { name, description } = req.body;

                const transport = await Transport.create({
                    name: name,
                    description: description
                })
        
                return res.json(transport);
            }
        });
    },

    getConditions(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    const conditions = await Condition.find({});
        
                    return res.json(conditions);
                } catch (error) {
                    return res.status(400).json({
                        message: 'No conditions yet'
                    });
                } 
            }
        });
    },

    getConditionById(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { conditionId } = req.params;

                try {
                    const condition = await Condition.findById(conditionId);
                    return res.json(condition);
                } catch (error) {
                    return res.status(400).json({
                        message: 'Condition does not exist'
                    });
                }
            }
        });
    },

    getTransports(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    const transports = await Transport.find({});
        
                    return res.json(transports);
                } catch (error) {
                    return res.status(400).json({
                        message: 'No transports yet'
                    });
                } 
            }
        });
    },

    getTransportById(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { transportId } = req.params;

                try {
                    const transport = await Transport.findById(transportId);
                    return res.json(transport);
                } catch (error) {
                    return res.status(400).json({
                        message: 'Transport does not exist'
                    });
                }
            }
        });
    }
}