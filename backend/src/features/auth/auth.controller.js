const authService = require("./auth.service");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.loginUser(email, password);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

module.exports = { login, getMe };
