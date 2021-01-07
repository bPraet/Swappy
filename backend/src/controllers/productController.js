const Product = require('../models/Product');
const User = require('../models/User');

module.exports = {
    async addProduct(req, res){
        const { name, description } = req.body;
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
            images: images
        })
            //images: String,
            //transport: String,
            //state: String}

        return res.json(product);
    },
    
    async getProductById(req, res){
        const { productId } = req.params;

        try {
            const product = await Product.findById(productId);
            return res.json(product);
        } catch (error) {
            return res.status(400).json({
                message: 'Product does not exist'
            });
        }
    }
}