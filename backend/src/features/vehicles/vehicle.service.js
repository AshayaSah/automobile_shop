const vehicleModel = require("./vehicle.model");

const registerVehicle = async (userId, data) => {
    return vehicleModel.createVehicle({
        ...data,
        user_id: userId,
    });
};

const getVehicleDetails = async (id) => {
    const vehicle = await vehicleModel.getVehicleById(id);
    if (!vehicle) {
        throw new Error("Vehicle not found");
    }
    return vehicle;
};

const listVehicles = async (filters) => {
    return vehicleModel.getVehicles(filters);
};

module.exports = {
    registerVehicle,
    getVehicleDetails,
    listVehicles,
};
