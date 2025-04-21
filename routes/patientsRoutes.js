const express = require("express");
const router = express.Router();
const PatientsS = require("../services/patientsS.js");
const verifyJWT = require("../middlewares/verifyJWT");

router.get("/all", verifyJWT, PatientsS.getPatients);
router.get("/id/:id", verifyJWT, PatientsS.getPatientsByID);
router.get("/email/:email", verifyJWT, PatientsS.getPatientsByEmail);
router.put("/update/:id", verifyJWT, PatientsS.updatePatient);

module.exports = router;
