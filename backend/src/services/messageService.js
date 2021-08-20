const Message = require("../models/Message");

module.exports = {
  addControl(user, message, image) {
    if (!user || (!message && !image)) {
      return false;
    }
    return true;
  },

  async getMessagesByUsers(user1, user2) {
    const messages = await Message.find().or([
      { $and: [{ user1: user1 }, { user2: user2 }] },
      { $and: [{ user1: user2 }, { user2: user1 }] },
    ]);

    return messages;
  },
};
