const vehicleService = require("./vehicle.service");

const createVehicle = async (req, res) => {
    try {
        const vehicle = await vehicleService.registerVehicle(
            req.user.id,
            req.body
        );
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await vehicleService.getVehicleDetails(id);
        res.json(vehicle);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

const getVehicles = async (req, res) => {
    const { type, minPrice, maxPrice } = req.query;

    const filters = { type, minPrice, maxPrice };

    const vehicles = await vehicleService.listVehicles(filters);
    res.json(vehicles);
};

const getMyVehicles = async (req, res) => {
    try {
        const vehicles = await vehicleService.getVehiclesByUser(req.user.id);
        res.json(vehicles);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await vehicleService.editVehicle(
            id,
            req.user.id,
            req.body
        );
        res.json(vehicle);
    } catch (err) {
        const status = err.message === "Unauthorized" ? 403
            : err.message === "Vehicle not found" ? 404
                : 400;
        res.status(status).json({ message: err.message });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        await vehicleService.removeVehicle(id, req.user.id);
        res.json({ message: "Vehicle deleted successfully" });
    } catch (err) {
        const status = err.message === "Unauthorized" ? 403
            : err.message === "Vehicle not found" ? 404
                : 400;
        res.status(status).json({ message: err.message });
    }
};

module.exports = {
    createVehicle,
    getVehicleById,
    getVehicles,
    getMyVehicles,
    updateVehicle,
    deleteVehicle,
};
