const pool = require("../../config/db");

const createUser = async (name, email, password) => {
    const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
        [name, email, password]
    );
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
    return result.rows[0];
};

const findUserById = async (id) => {
    const result = await pool.query(
        "SELECT id, name, email FROM users WHERE id=$1", // never return password
        [id]
    );
    return result.rows[0];
};

const getAllUsers = async () => {
    const result = await pool.query("SELECT id, name, email FROM users");
    return result.rows;
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers,
};
