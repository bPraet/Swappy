const User = require('../models/User');
const bcrypt = require('bcrypt');

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

                return res.json(user);
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
                    _id: user._id,
                    email: user.email
                }
                return res.json(userResponse);
            }
            else{
                return res.status(200).json({message: "Email or password doesn't match"});
            }
        } catch (error) {
            throw Error(`Error while Authenticating a user ${error}`);
        }
    }
}