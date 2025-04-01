// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const UserManagment = require("../modelo/userManagment"); // Importa el modelo de gestión de usuarios

router.get("/get", UserManagment.getUsers);

module.exports = router; // Exporta el router
