const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+])[A-Za-z\d@$!%*?&+]{8,}$/gm;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = {
    async registerControl(firstName, lastName, password, email, pseudo, adress, roleid){
        const existentEmail = await User.findOne({email});
        const existentPseudo = await User.findOne({pseudo});

        if(!email || !password || !firstName || !lastName || !password || !pseudo || !adress || !roleid){
            return "Champ requis manquant !";
        }

        if(!password.match(regex)){
            return "Mot de passe invalide (Minimum 8 caractères dont 1 majuscule, 1 nombre et 1 caractère spécial(@$!%*?&+))";
        }

        if(existentEmail || existentPseudo){
            return "L’utilisateur existe déjà !";
        }

        return true;
    },

    async create(firstName, lastName, password, email, pseudo, adress, roleid){
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

        return newUser;
    },

    async loginControl(email, password){
        const user = await User.findOne({email});

        if(!email || !password){
            return "Champ requis manquant !";
        }

        if(!user){
            return "L'utilisateur n'existe pas ! Voulez-vous vous inscrire plutôt ?";
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return "L'email et le mot de passe ne correspondent pas";
        }

        const userResponse = {
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            pseudo: user.pseudo,
            adress: user.adress,
            role: user.role
        };

        return userResponse;
    },
}