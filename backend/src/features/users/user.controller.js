const userService = require("./user.service");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userService.registerUser(name, email, password);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getUsers = async (req, res) => {
    const users = await userService.listUsers();
    res.json(users);
};

module.exports = {
    register,
    getUsers,
};
