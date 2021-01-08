const User = require('../models/User');
const Role = require('../models/Role');

module.exports = {
    async getUserById(req, res) {
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
    },

    async addRole(req, res) {
        const { name, description } = req.body;

        const role = await Role.create({
            name: name,
            description: description
        })

        return res.json(role);
    }
}