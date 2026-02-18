const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./features/users/user.routes");
const authRoutes = require("./features/auth/auth.routes");
const vehicleRoutes = require("./features/vehicles/vehicle.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);


module.exports = app;
