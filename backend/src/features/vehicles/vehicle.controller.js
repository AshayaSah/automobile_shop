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

module.exports = {
    createVehicle,
    getVehicleById,
    getVehicles,
};
