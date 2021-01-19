const Match = require('../models/Match');

const jwt = require('jsonwebtoken');

module.exports = {
    addMatch(req, res){
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            }
            else {
                const { productOwner, productConsignee, consignee } = req.body;

                const match = await Match.create({
                    user: authData.user.userId,
                    productOwner: productOwner,
                    consignee: consignee,
                    productConsignee: productConsignee
                });

                return res.json(match);
            }
        });
    }
}