const Message = require("../models/Message");
const mongoose = require('mongoose');

module.exports = {
  addControl(user, message, image) {
    if (!user || (!message && !image)) {
      return false;
    }
    return true;
  },

  async getByUsers(user1, user2) {
    if(!mongoose.Types.ObjectId.isValid(user2))
      return [];
    const messages = await Message.find().or([
      { $and: [{ user1: user1 }, { user2: user2 }] },
      { $and: [{ user1: user2 }, { user2: user1 }] },
    ]);

    return messages;
  },

  async add(userId, user, message, image) {
    const response = await Message.create({
      user1: userId,
      user2: user,
      message: message,
      image: image,
    });

    return response;
  },
};
