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
    }
}