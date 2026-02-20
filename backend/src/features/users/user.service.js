const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./user.model");

const registerUser = async (name, email, password) => {
    const existing = await userModel.findUserByEmail(email);
    if (existing) throw new Error("Email already in use");

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(name, email, hashed);

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return { token, user };
};

const listUserByEmail = async (email) => {
    return userModel.findUserByEmail(email);
};

const listUsers = async () => {
    return userModel.getAllUsers();
};

module.exports = {
    registerUser,
    listUserByEmail,
    listUsers,
};
