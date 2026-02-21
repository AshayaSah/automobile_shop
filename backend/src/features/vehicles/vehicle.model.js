const pool = require("../../config/db");

const createVehicle = async (data) => {
    const {
        user_id,
        type,
        model,
        price,
        description,
        condition,
        contact,
        images,
    } = data;

    const result = await pool.query(
        `INSERT INTO vehicles 
    (user_id, type, model, price, description, condition, contact, images)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
        [user_id, type, model, price, description, condition, contact, images]
    );

    return result.rows[0];
};

const getVehicleById = async (id) => {
    const result = await pool.query(
        `SELECT v.*, u.name as owner_name
     FROM vehicles v
     JOIN users u ON v.user_id = u.id
     WHERE v.id = $1`,
        [id]
    );

    return result.rows[0];
};


const getVehicles = async (filters) => {
    let query = `SELECT v.*, u.name as owner_name 
               FROM vehicles v
               JOIN users u ON v.user_id = u.id`;

    let conditions = [];
    let values = [];

    if (filters.type) {
        values.push(filters.type);
        conditions.push(`v.type = $${values.length}`);
    }

    if (filters.minPrice) {
        values.push(filters.minPrice);
        conditions.push(`v.price >= $${values.length}`);
    }

    if (filters.maxPrice) {
        values.push(filters.maxPrice);
        conditions.push(`v.price <= $${values.length}`);
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY v.created_at DESC";

    const result = await pool.query(query, values);
    return result.rows;
};

const findVehiclesByUserId = async (userId) => {
    const result = await pool.query(
        "SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    return result.rows;
};

const updateVehicle = async (id, data) => {
    const { type, model, price, description, condition, contact, images } = data;

    const result = await pool.query(
        `UPDATE vehicles
         SET type=$1, model=$2, price=$3, description=$4,
             condition=$5, contact=$6, images=$7
         WHERE id=$8
         RETURNING *`,
        [type, model, price, description, condition, contact, images, id]
    );

    return result.rows[0];
};

const deleteVehicle = async (id) => {
    await pool.query("DELETE FROM vehicles WHERE id=$1", [id]);
};


module.exports = {
    createVehicle,
    getVehicleById,
    getVehicles,
    findVehiclesByUserId,
    updateVehicle,
    deleteVehicle
};
