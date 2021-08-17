const AlreadySeen = require('../models/AlreadySeen');
const Match = require('../models/Match');
const Product = require('../models/Product');

module.exports = {
    async getNotSeenProducts(userId){
        const alreadySeenProducts = await AlreadySeen.find({user: userId});
        const matchedProducts = await Match.find().or([{owner: userId}, {consignee: userId}]);
        const toRemoveSeen = alreadySeenProducts.map((seenProduct) => {return {"_id" : seenProduct.product};});
        const toRemoveMatch = matchedProducts.map((matchedProducts) => {return {"_id" : matchedProducts.productOwner};});
        const products = await Product.find({$and: [{_id: { $nin: toRemoveSeen } }, {_id: { $nin: toRemoveMatch } }, {user: { $nin: userId } }]}).sort({"_id":1}).limit(3);

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

    addControl(name, description, conditionId, transportId, image){
        if(!name || !description || !conditionId || !transportId)
            return 'Champs requis manquant !';

        if(name === 'undefined' || description === 'undefined')
            return 'Champs requis manquant !';

        if(name.length > 50)
            return 'Nom de maximum 50 caractères !';
                
        if(description.length > 1500)
            return 'Description de maximum 1500 caractères !';

        if(!image)
            return "Veuillez uploader une image de 5Mo ou moins s'il vous plait ! (.jpg, .jpeg)";

        return false;
    },

    updateControl(name, description, conditionId, transportId){
        if(!name || !description || !conditionId || !transportId)
            return 'Champs requis manquant !';

        if(name === 'undefined' || description === 'undefined')
            return 'Champs requis manquant !';

        if(name.length > 50)
            return 'Nom de maximum 50 caractères !';
                
        if(description.length > 1500)
            return 'Description de maximum 1500 caractères !';

        return false;
    }
}