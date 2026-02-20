const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../users/user.model");

const loginUser = async (email, password) => {
    const user = await userModel.findUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return token;
};

const getMe = async (id) => {
    const user = await userModel.findUserById(id);
    if (!user) throw new Error("User not found");
    return user;
};

module.exports = { loginUser, getMe };
