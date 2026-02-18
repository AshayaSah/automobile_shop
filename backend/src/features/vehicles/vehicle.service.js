const vehicleModel = require("./vehicle.model");

const registerVehicle = async (userId, data) => {
    return vehicleModel.createVehicle({
        ...data,
        user_id: userId,
    });
};

const listVehicles = async (filters) => {
    return vehicleModel.getVehicles(filters);
};

module.exports = {
    registerVehicle,
    listVehicles,
};
