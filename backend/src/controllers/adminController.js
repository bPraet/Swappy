const User = require('../models/User');
const Product = require('../models/Product');
const Match = require('../models/Match');
const Message = require('../models/Message');
const Swap = require('../models/Swap');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const handlebars = require('handlebars');
const fs = require('fs');
const Role = require('../models/Role');
const { userTypes } = require('../services/userTypes');

const readHTMLFile = (path, callback) => {
    fs.readFile(path, {encoding: 'utf-8'}, (err, html) => {
        if (err) {
            console.log(err);
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

module.exports = {
    getUsers(req, res) {
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                try {
                    const user = await User.find({});

                    return res.json(user);
                } catch (error) {
                    return res.status(400).json({
                        message: 'User does not exist, do you want to register instead ?'
                    });
                }
            }
        });
    },

    deleteUser(req, res) {
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if(err) {
                res.sendStatus(403);
            }
            else {
                const { userId } = req.params;

                try{
                    await User.deleteMany({ "_id" : userId});
                    await Match.deleteMany({ "consignee" : userId});
                    await Match.deleteMany({ "owner" : userId});
                    await Message.deleteMany({ "user1" : userId});
                    await Message.deleteMany({ "user2" : userId});
                    await Swap.deleteMany({ "consignee" : userId});
                    await Swap.deleteMany({ "owner" : userId});

                    await Product.find({user: userId})
                    .then(async (products) => {
                        console.log(products);
                        for(const product of products) {
                            await Product.deleteOne({"_id" : product._id});
                            fs.unlink(`./files/${product.image}`, () => {});
                        }
                    });

                    return res.send('User deleted');
                } catch(err){
                    console.log(err);
                    return res.status(400).json("Can't delete this user for the moment, try again later...");
                }
            }
        });
    },

    sendEmail(req, res) {
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if(err) {
                res.sendStatus(403);
            }
            else {
                const { email, message } = req.body;

                if(!email || !message){
                    return res.json('Field missing');
                }

                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'swappy.contact@gmail.com',
                        pass: 'Password1$',
                    },
                });

                //test
                readHTMLFile('email/index.html', async (err, html) => {
                    const template = handlebars.compile(html);
                    const replacements = {
                         message: message
                    };
                    const htmlToSend = template(replacements);

                     await transporter.sendMail({
                        from: 'Swappy',
                        to: email,
                        subject: "Message administrateur",
                        html: htmlToSend
                        
                    })
                    .then(
                        res.send('Email envoyé avec succès !')
                    )
                    .catch(
                        (error) => res.send(error.message)
                    );
                });
            }
        });
    },

    isAdmin(req, res) {
        jwt.verify(req.token, process.env.SECRET, async(err, authData) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                if(authData.user.role === userTypes.ADMIN)
                    res.send(true)
                else
                    res.send(false)
            }
        });
    },
}