const Match = require('../models/Match');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = {
    addMatch(req, res){
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if(err) {
                res.sendStatus(403);
            }
            else {
                const { productOwner, productConsignee, owner } = req.body;
                
                if(!productOwner || !productConsignee || !owner){
                    return res.json('Field missing');
                }

                const match = await Match.create({
                    consignee: authData.user.userId,
                    productOwner: productOwner,
                    owner: owner,
                    productConsignee: productConsignee
                });

                return res.json(match);
            }
        });
    },

    getMatchsByUser(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    const matchs = await Match.aggregate([
                        {$match : {"owner" : mongoose.Types.ObjectId(authData.user.userId)}},
                        {$group : { _id: { consignee: "$consignee", productOwner: "$productOwner" }}}
                    ]);

                    return res.json(matchs);
                } catch (error) {
                    console.log(error);
                }
            }
        });
    },

    delMatchesByProductId(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { productId } = req.params;
                try {
                    await Match.deleteMany({ "productOwner" : productId});
                    await Match.deleteMany({ "productConsignee" : productId});
                    return res.json({message: "Successfully deleted"});
                } catch (error) {
                    return res.status(400).json({
                        message: 'No match found'
                    });
                }
            }
        });
    },
}