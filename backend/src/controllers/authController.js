const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

module.exports = {
    async register(req, res){
        try {
            const { firstName, lastName, password, email, pseudo, adress, roleid } = req.body;
            const control = await userService.registerControl(firstName, lastName, password, email, pseudo, adress, roleid);

            if(control === true){
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

                let newUser = user.toObject();
                newUser.userId = newUser._id;

                return jwt.sign({user: newUser}, process.env.SECRET, (err, token) => {
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
            
            if(!email || !password){
                return res.json({message: "Champ requis manquant"});
            }

            const user = await User.findOne({email});
            if(!user){
                return res.json({message: "L'utilisateur n'existe pas ! Voulez-vous vous inscrire plutôt ?"});
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

                return jwt.sign({user: userResponse}, process.env.SECRET, {expiresIn: '24h'},(err, token) => {
                    return res.json({
                        userToken: token
                    })
                })
            }
            else{
                return res.json({message: "L'email et le mot de passe ne correspondent pas"});
            }
        } catch (error) {
            throw Error(`Error while Authenticating a user ${error}`);
        }
    }
}