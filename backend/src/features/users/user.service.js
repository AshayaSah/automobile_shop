const bcrypt = require("bcrypt");
const userModel = require("./user.model");

const registerUser = async (name, email, password) => {
    const existing = await userModel.findUserByEmail(email);
    if (existing) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return userModel.createUser(name, email, hashedPassword);
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
