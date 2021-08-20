const Condition = require("../models/Condition");

module.exports = {
  async add(name, description) {
    const condition = await Condition.create({
      name: name,
      description: description,
    });

    return condition;
  },

  async getAll() {
    const conditions = await Condition.find({});

    return conditions;
  },

  async getById(conditionId) {
    const condition = await Condition.findById(conditionId);

    return condition;
  },
};
