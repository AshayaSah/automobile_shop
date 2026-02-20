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

const getVehiclesByUser = async (userId) => {
    return vehicleModel.findVehiclesByUserId(userId);
};

const editVehicle = async (id, userId, data) => {
    // Verify ownership before updating
    const existing = await vehicleModel.getVehicleById(id);
    if (!existing) throw new Error("Vehicle not found");
    if (String(existing.user_id) !== String(userId))
        throw new Error("Unauthorized");

    return vehicleModel.updateVehicle(id, data);
};

const removeVehicle = async (id, userId) => {
    // Verify ownership before deleting
    const existing = await vehicleModel.getVehicleById(id);
    if (!existing) throw new Error("Vehicle not found");
    if (String(existing.user_id) !== String(userId))
        throw new Error("Unauthorized");

    return vehicleModel.deleteVehicle(id);
};

module.exports = {
    registerVehicle,
    getVehicleDetails,
    listVehicles,
    getVehiclesByUser,
    editVehicle,
    removeVehicle,
};
