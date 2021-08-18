const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const handlebars = require('handlebars');
const fs = require('fs');

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
    }
}