const Match = require('../models/Match');

const jwt = require('jsonwebtoken');

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
    }
}