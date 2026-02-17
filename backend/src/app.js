const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./features/users/user.routes");
const authRoutes = require("./features/auth/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);


module.exports = app;
