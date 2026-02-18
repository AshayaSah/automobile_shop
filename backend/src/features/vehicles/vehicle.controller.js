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

const getVehicles = async (req, res) => {
    const { type, minPrice, maxPrice } = req.query;

    const filters = { type, minPrice, maxPrice };

    const vehicles = await vehicleService.listVehicles(filters);
    res.json(vehicles);
};

module.exports = {
    createVehicle,
    getVehicles,
};
