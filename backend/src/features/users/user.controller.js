const userService = require("./user.service");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { token, user } = await userService.registerUser(name, email, password);
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userService.listUserByEmail(email);
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
    getUserByEmail,
    getUsers,
};
