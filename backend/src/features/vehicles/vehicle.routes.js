const express = require("express");
const router = express.Router();
const vehicleController = require("./vehicle.controller");
const protect = require("../auth/auth.middleware");

router.post("/", protect, vehicleController.createVehicle);
router.get("/", vehicleController.getVehicles);
router.get("/my", protect, vehicleController.getMyVehicles);
router.get("/:id", vehicleController.getVehicleById);
router.put("/:id", protect, vehicleController.updateVehicle);
router.delete("/:id", protect, vehicleController.deleteVehicle);

module.exports = router;
