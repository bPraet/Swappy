const AlreadySeen = require('../models/AlreadySeen');

const jwt = require('jsonwebtoken');

module.exports = {
    addAlreadySeen(req, res){
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            }
            else {
                const { productId } = req.body;

                const alreadySeen = await AlreadySeen.create({
                    user: authData.user.userId,
                    product: productId
                });

                return res.json(alreadySeen);
            }
        });
    },
    resetAlreadySeen(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    await AlreadySeen.deleteMany({"user": authData.user.userId});
                    return res.json({message: "Successfully deleted"});
                } catch (error) {
                    return res.status(400).json({
                        message: "Impossible to delete already seen products"
                    });
                }
            }
        });
    }
}