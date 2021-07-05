const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+])[A-Za-z\d@$!%*?&+]{8,}$/gm;
const User = require('../models/User');

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
}