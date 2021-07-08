const AlreadySeen = require('../models/AlreadySeen');
const Match = require('../models/Match');
const Product = require('../models/Product');

module.exports = {
    async getNotSeenProducts(userId){
        const alreadySeenProducts = await AlreadySeen.find({user: userId});
        const matchedProducts = await Match.find().or([{owner: userId}, {consignee: userId}]);
        const toRemoveSeen = alreadySeenProducts.map((seenProduct) => {return {"_id" : seenProduct.product};});
        const toRemoveMatch = matchedProducts.map((matchedProducts) => {return {"_id" : matchedProducts.productOwner};});
        const products = await Product.find({$and: [{_id: { $nin: toRemoveSeen } }, {_id: { $nin: toRemoveMatch } }, {user: { $nin: userId } }]});

        return products;
    },

    async getDetails(id){
        const product = await Product.findById(id);
        await product.populate('user', '-password')
            .populate('condition')
            .populate('transport')
            .execPopulate();

        return product;
    },

    updateControl(name, description, conditionId, transportId){
        if(!name || !description || !conditionId || !transportId){
            return false;
        }

        return true;
    }
}