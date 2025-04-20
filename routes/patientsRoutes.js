const express = require("express");
const router = express.Router();
const PatientsS = require("../services/patientsS.js");
const verifyJWT = require("../middlewares/verifyJWT");

router.get("/all", PatientsS.getPatients);
router.get("/id/:id", PatientsS.getPatientsByID);
router.get("/email/:email", PatientsS.getPatientsByEmail);

module.exports = router;
