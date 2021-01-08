const Condition = require('../models/Condition');
const Product = require('../models/Product');
const User = require('../models/User');

module.exports = {
    async addProduct(req, res){
        const { name, description, conditionid } = req.body;
        const { userid } = req.headers;
        const images = req.file.filename;

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
            images: images,
            condition: conditionid
        })
            //images: String,
            //transport: String

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
    }
}