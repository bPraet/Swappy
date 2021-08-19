const User = require('../models/User');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerToken = req.header('userToken');

    jwt.verify(bearerToken, process.env.SECRET, async(err, authData) => {
        if(err){
            res.sendStatus(403);
        }
        else{
            try {
                await User.findById(authData.user.userId).then(user => {
                    if(user){
                        req.token = bearerToken;
                        next();
                    }
                    else{
                        res.sendStatus(403);
                    }
                });
            } catch (error) {
                return res.sendStatus(403);
            }
        }
    });
}

module.exports = verifyToken;