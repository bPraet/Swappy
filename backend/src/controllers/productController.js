const Condition = require('../models/Condition');
const Product = require('../models/Product');
const Transport = require('../models/Transport');
const User = require('../models/User');

module.exports = {
    async addProduct(req, res){
        const { name, description, conditionId, transportId } = req.body;
        const { userid } = req.headers;
        const image = req.file.filename;

        const user = await User.findById(userid);

        if(!user){
            return res.status(400).json({
                message: "User does not exists"
            });
        }

        const product = await Product.create({
            name: name,
            description: description,
            user: userid,
            image: image,
            condition: conditionId,
            transport: transportId
        })

        return res.json(product);
    },
    
    async getProductById(req, res){
        const { productId } = req.params;

        try {
            const product = await Product.findById(productId);
            await product.populate('user', '-password')
                .populate('condition')
                .execPopulate();

            return res.json(product);
        } catch (error) {
            return res.status(400).json({
                message: 'Product does not exist'
            });
        }
    },

    async getProductByUserId(req, res){
        const { userid } = req.headers;

        try {
            const products = await Product.find({user: userid});
            return res.json(products);
        } catch (error) {
            return res.status(400).json({
                message: 'No products yet'
            });
        }
    },

    async getProducts(req, res){
        try {
            const products = await Product.find({});
            //await products.populate('user', '-password').populate('condition').execPopulate();

            return res.json(products);
        } catch (error) {
            return res.status(400).json({
                message: 'No products yet'
            });
        }
    },

    async delProduct(req, res){
        const { productId } = req.params;
        try {
            await Product.findByIdAndDelete(productId);
            return res.json({message: "Successfully deleted"});
        } catch (error) {
            return res.status(400).json({
                message: 'Product does not exist'
            });
        }
    },

    async addCondition(req, res){
        const { name, description } = req.body;

        const condition = await Condition.create({
            name: name,
            description: description
        })

        return res.json(condition);
    },

    async addTransport(req, res){
        const { name, description } = req.body;

        const transport = await Transport.create({
            name: name,
            description: description
        })

        return res.json(transport);
    },

    async getConditions(req, res){
        try {
            const conditions = await Condition.find({});

            return res.json(conditions);
        } catch (error) {
            return res.status(400).json({
                message: 'No conditions yet'
            });
        } 
    },

    async getTransports(req, res){
        try {
            const transports = await Transport.find({});

            return res.json(transports);
        } catch (error) {
            return res.status(400).json({
                message: 'No transports yet'
            });
        } 
    }
}