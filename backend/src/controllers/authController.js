const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const { userTypes } = require('../services/userTypes');

module.exports = {
    async register(req, res){
        try {
            const { firstName, lastName, password, email, pseudo, adress } = req.body;
            const roleid = userTypes.USER;
            const control = await userService.registerControl(firstName, lastName, password, email, pseudo, adress, roleid);

            if(control === true){
                const user = await userService.create(firstName, lastName, password, email, pseudo, adress, roleid);

                return jwt.sign({user: user}, process.env.SECRET, (err, token) => {
                    return res.json({
                        userToken: token
                    })
                })
            }

            return res.json({
                message: control
            });
            
        } catch (error) {
            throw Error(`Error while registering a new user: ${error}`);
        }
    },

    async login(req, res){
        try {
            const { email, password } = req.body;
            const control = await userService.loginControl(email, password);

            if(control instanceof Object){
                return jwt.sign({user: control}, process.env.SECRET, {expiresIn: '24h'},(err, token) => {
                    return res.json({
                        userToken: token
                    })
                })
            }
                
            return res.json({message: control});

        } catch (error) {
            throw Error(`Error while Authenticating a user ${error}`);
        }
    }
}