const express = require("express");
const router = express.Router();
const UsersS = require("../services/userS.js");
const verifyJWT = require("../middlewares/verifyJWT");

router.get("/all", verifyJWT, UsersS.getUsers);
router.get("/id/:id", verifyJWT, UsersS.getUsersByID);
router.get("/email/:email", verifyJWT, UsersS.getUsersByEmail);
router.get("/name/:name", verifyJWT, UsersS.getUsersByName);
router.get("/role/:role", verifyJWT, UsersS.getUsersByRole);
router.put("/update/:id", verifyJWT, UsersS.updateUserById);
router.delete("/delete/:id", verifyJWT, UsersS.deleteUserById);
router.post("/register", verifyJWT, UsersS.registrerUser);

module.exports = router;
