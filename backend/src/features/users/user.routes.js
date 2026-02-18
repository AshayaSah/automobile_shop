const express = require("express");
const router = express.Router();
const userController = require("./user.controller");

router.post("/register", userController.register);
router.post("/get", userController.getUserByEmail);
router.get("/", userController.getUsers);

module.exports = router;
