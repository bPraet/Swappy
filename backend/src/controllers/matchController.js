const Match = require('../models/Match');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = {
    addMatch(req, res){
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            }
            else {
                const { productOwner, productConsignee, owner } = req.body;
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
    }
}