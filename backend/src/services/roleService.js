const Role = require("../models/Role");

module.exports = {
  async add(name, description) {
    const role = await Role.create({
      name: name,
      description: description,
    });

    return role;
  },
};
