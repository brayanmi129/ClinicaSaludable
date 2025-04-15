// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const UsersS = require("../services/userS.js"); // Importa el modelo de gestión de usuarios

router.get("/get/all", UsersS.getUsers);
router.get("/get/id/:id", UsersS.getUsersByID);
router.get("/get/email/:email", UsersS.getUsersByEmail);
router.get("/get/role/:role", UsersS.getUsersByRole);
router.post("/update/:id", UsersS.updateUserById);
router.delete("/delete/:id", UsersS.deleteUserById);
router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "No autenticado" });
  }
  res.json(req.user);
});

module.exports = router; // Exporta el router
