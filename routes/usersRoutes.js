const express = require("express");
const router = express.Router();
const UsersS = require("../services/userS.js");

router.get("/all", UsersS.getUsers);
router.get("/id/:id", UsersS.getUsersByID);
router.get("/email/:email", UsersS.getUsersByEmail);
router.get("/role/:role", UsersS.getUsersByRole);
router.post("/update/:id", UsersS.updateUserById);
router.delete("/delete/:id", UsersS.deleteUserById);
router.post("/register", UsersS.registrerUser);

module.exports = router;
