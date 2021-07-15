const Swap = require("../models/Swap");
const jwt = require('jsonwebtoken');

module.exports = {
    addSwap(req, res){
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if(err) {
                res.sendStatus(403);
            }
            else {
                const { owner, products, consignee } = req.body;
                
                if(!products || !consignee || !owner){
                    return res.json('Field missing');
                }

                const swap = await Swap.create({
                    consignee: consignee,
                    products: products,
                    owner: owner
                });

                return res.json(swap);
            }
        });
    },

    getSwapsByUser(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    const swaps = await Swap.find().or([{owner: authData.user.userId}, {consignee: authData.user.userId}])
                    .populate('owner')
                    .populate('consignee');

                    return res.json(swaps);
                } catch (error) {
                    console.log(error);
                }
            }
        });
    },
}