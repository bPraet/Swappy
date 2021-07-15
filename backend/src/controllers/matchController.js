const Match = require('../models/Match');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

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
                    let results = await Match.aggregate([
                        {$match : {"owner" : mongoose.Types.ObjectId(authData.user.userId)}},
                        {$group : { _id: { consignee: "$consignee", productOwner: "$productOwner" }}}
                    ]).sort('field _id');;
            
                    results = results.map((result) => {
                        result.consignee = result._id.consignee;
                        result.productOwner = result._id.productOwner;
                        delete(result._id);
                        return result;
                    });

                    const matchsConsignee = await User.populate(results, {path: 'consignee'});
                    const matchs = await Product.populate(matchsConsignee, {path: 'productOwner'});

                    return res.json(matchs);
                } catch (error) {
                    console.log(error);
                }
            }
        });
    },

    getPropositionsByUser(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    let results = await Match.aggregate([
                        {$match : {"consignee" : mongoose.Types.ObjectId(authData.user.userId)}},
                        {$group : { _id: { owner: "$owner", productOwner: "$productOwner" }}}
                    ]).sort('field _id');

                    results = results.map((result) => {
                        result.owner = result._id.owner;
                        result.productOwner = result._id.productOwner;
                        delete(result._id);
                        return result;
                    });

                    const matchsOwner = await User.populate(results, {path: 'owner'});
                    const propositions = await Product.populate(matchsOwner, {path: 'productOwner'});

                    return res.json(propositions);
                } catch (error) {
                    console.log(error);
                }
            }
        });
    },

    getMatchDetails(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { owner, consignee, productId } = req.params;
                try {
                    const matchs = await Match.find().and([{owner: owner, consignee: consignee, productOwner: productId}]);

                    return res.json(matchs);
                } catch (error) {
                    console.log(error);
                }
            }
        });
    },

    delMatchById(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { matchId } = req.params;

                try{
                    await Match.findByIdAndDelete(matchId);
                } catch(err){
                    return res.status(400).json("Match not found");
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

    delMatchesByProductIdAndConsignee(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { productId, consigneeId } = req.params;
                try {
                    await Match.deleteMany({ "productOwner" : productId, "consignee" : consigneeId});

                    return res.json({message: "Successfully deleted"});
                } catch (error) {
                    return res.status(400).json({
                        message: 'No match found'
                    });
                }
            }
        });
    }
}