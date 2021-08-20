const Transport = require("../models/Transport");

module.exports = {
  async add(name, description) {
    const transport = await Transport.create({
      name: name,
      description: description,
    });

    return transport;
  },

  async getAll() {
    const transports = await Transport.find({});

    return transports;
  },

  async getById(transportId) {
    const transport = await Transport.findById(transportId);

    return transport;
  },
};
