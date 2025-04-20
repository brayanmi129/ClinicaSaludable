const express = require("express");
const router = express.Router();
const MedicalRecordsS = require("../services/MedicalRecordsS.js");

router.get("/all", MedicalRecordsS.getRecords);
router.get("/id/:id", MedicalRecordsS.getRecordsByID);
router.get("/patient/:id", MedicalRecordsS.getRecordByPatient);

module.exports = router;
