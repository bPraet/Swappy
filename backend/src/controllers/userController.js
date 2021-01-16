const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { json } = require('express');

module.exports = {
    getUserById(req, res) {
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { userId } = req.params;

                try {
                    const user = await User.findById(userId);
                    await user.populate('role').execPopulate();
                    
                    return res.json(user);
                } catch (error) {
                    return res.status(400).json({
                        message: 'User does not exist, do you want to register instead ?'
                    });
                }
            }
        });
    },

    addRole(req, res) {
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { name, description } = req.body;

                const role = await Role.create({
                    name: name,
                    description: description
                })
        
                return res.json(role);
            }
        });
    },

    getProfile(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    const user = await User.findById(authData.user.userId);
                    return res.json(user);
                } catch (error) {
                    return res.status(400).json({
                        message: 'User does not exist'
                    });
                }
            }
        });
    },
    
    updateProfile(req, res){
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                const { email, password, lastName, firstName, pseudo, adress } = req.body;
                try {
                    if(!password){
                        await User.findByIdAndUpdate(authData.user.userId, {
                            email: email,
                            lastName: lastName,
                            firstName: firstName,
                            pseudo: pseudo,
                            adress: adress
                        }, {useFindAndModify: false});
                    }
                    else{
                        const hashedPassword = await bcrypt.hash(password, 10);
                        await User.findByIdAndUpdate(authData.user.userId, {
                            email: email,
                            password: hashedPassword,
                            lastName: lastName,
                            firstName: firstName,
                            pseudo: pseudo,
                            adress: adress
                        }, {useFindAndModify: false});
                    }

                    return res.json({message: "Successfully updated"});
                } catch (error) {
                    return res.status(400).json({
                        message: 'User does not exist'
                    })
                }
            }
        });
    }
}