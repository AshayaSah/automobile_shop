const express = require("express");
const router = express.Router();
const vehicleController = require("./vehicle.controller");
const protect = require("../auth/auth.middleware");

router.post("/", protect, vehicleController.createVehicle);
router.get("/", vehicleController.getVehicles);
router.get("/:id", vehicleController.getVehicleById);

module.exports = router;
