const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    async register(req, res){
        try {
            const { firstName, lastName, password, email, pseudo, adress, roleid } = req.body;

            const existentUser = await User.findOne({email});

            if(!email || !password || !firstName || !lastName || !password || !pseudo || !adress){
                return res.status(200).json({message: "Champ requis manquant !"});
            }

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

            return res.status(200).json({
                message: 'L’utilisateur existe déjà !'
            });
            
        } catch (error) {
            throw Error(`Error while registering a new user: ${error}`);
        }
    },

    async login(req, res){
        try {
            const { email, password } = req.body;
            
            if(!email || !password){
                return res.status(200).json({message: "Champ requis manquant"});
            }

            const user = await User.findOne({email});
            if(!user){
                return res.status(200).json({message: "L'utilisateur n'existe pas ! Voulez-vous vous inscrire plutôt ?"});
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
                return res.status(200).json({message: "L'email et le mot de passe ne correspondent pas"});
            }
        } catch (error) {
            throw Error(`Error while Authenticating a user ${error}`);
        }
    }
}