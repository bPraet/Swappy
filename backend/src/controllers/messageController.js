const Message = require("../models/Message");
const jwt = require('jsonwebtoken');

module.exports = {
    addMessage(req, res){
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if(err) {
                res.sendStatus(403);
            }
            else {
                const { user, message, image } = req.body;

                if(!user || !message && !image){
                    return res.json('Field missing');
                }

                const response = await Message.create({
                    user1: authData.user.userId,
                    user2: user,
                    message: message,
                    image: image
                });

                return res.json(response);
            }
        });
    },

    getMessagesByUser(req, res){
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if(err) {
                res.sendStatus(403);
            }
            else {
                const { user } = req.params;
                try {
                    const messages = await Message.find()
                    .or([{$and : [{user1: authData.user.userId}, {user2: user}]}, {$and : [{user1: user}, {user2: authData.user.userId}]}]);

                    return res.json(messages);
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }
}