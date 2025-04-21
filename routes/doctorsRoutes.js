const express = require("express");
const router = express.Router();
const DoctorsS = require("../services/doctorsS.js");
const verifyJWT = require("../middlewares/verifyJWT");

router.get("/all", verifyJWT, DoctorsS.getDoctors);
router.get("/id/:id", verifyJWT, DoctorsS.getDoctorsByID);
router.get("/email/:email", verifyJWT, DoctorsS.getDoctorsByEmail);

router.put("/update/:id", verifyJWT, DoctorsS.updateDoctorById);

module.exports = router;
