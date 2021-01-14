const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async register(req, res){
        try {
            const { firstName, lastName, password, email, pseudo, adress, roleid } = req.body;

            const existentUser = await User.findOne({email});

            if(!existentUser){
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await User.create({
                    firstName: firstName,
                    lastName: lastName,
                    password: hashedPassword,
                    email: email,
                    pseudo: pseudo,
                    adress: adress,
                    role: roleid
                });

                return jwt.sign({user: user}, process.env.SECRET, (err, token) => {
                    return res.json({
                        userToken: token
                    })
                })
            }

            return res.status(400).json({
                message: 'email/user already exists ! Do you want to login instead ?'
            });
            
        } catch (error) {
            throw Error(`Error while registering a new user: ${error}`);
        }
    },

    async login(req, res){
        try {
            const { email, password } = req.body;
            
            if(!email || !password){
                return res.status(200).json({message: "Required field missing"});
            }

            const user = await User.findOne({email});
            if(!user){
                return res.status(200).json({message: 'User not found ! Do you want to register instead ?'});
            }

            if(user && await bcrypt.compare(password, user.password)){
                const userResponse = {
                    userId: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    pseudo: user.pseudo,
                    adress: user.adress,
                    role: user.role
                };

                return jwt.sign({user: userResponse}, process.env.SECRET, (err, token) => {
                    return res.json({
                        userToken: token
                    })
                })
            }
            else{
                return res.status(200).json({message: "Email or password doesn't match"});
            }
        } catch (error) {
            throw Error(`Error while Authenticating a user ${error}`);
        }
    }
}