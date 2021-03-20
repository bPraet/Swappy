const Condition = require('../models/Condition');
const Product = require('../models/Product');
const Transport = require('../models/Transport');
const User = require('../models/User');
const AlreadySeen = require('../models/AlreadySeen');

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
                const image = req.file.filename;

                const user = await User.findById(authData.user.userId);

                if (!user) {
                    return res.status(400).json({
                        message: "User does not exists"
                    });
                }

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
                    const product = await Product.findById(productId);
                    await product.populate('user', '-password')
                        .populate('condition')
                        .populate('transport')
                        .execPopulate();
        
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
                    const alreadySeenProducts = await AlreadySeen.find({user: authData.user.userId});
                    const toRemove = alreadySeenProducts.map((seenProduct) => {
                        return {"_id" : seenProduct.product};
                    });
                    const products = await Product.find({$and: [{_id: { $nin: toRemove } }, {user: { $nin: authData.user.userId } }]});
                    return res.json(products);
                } catch (error) {
                    console.log(error);
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
                try {
                    await Product.findByIdAndDelete(productId);
                    return res.json({message: "Successfully deleted"});
                } catch (error) {
                    return res.status(400).json({
                        message: 'Product does not exist'
                    });
                }
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