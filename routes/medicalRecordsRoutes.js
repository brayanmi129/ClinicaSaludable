const express = require("express");
const router = express.Router();
const MedicalRecordsS = require("../services/MedicalRecordsS.js");

router.get("/all", MedicalRecordsS.getRecords);
router.get("/id/:id", MedicalRecordsS.getRecordsByID);
router.get("/patient/:id", MedicalRecordsS.getRecordByPatient);

router.post("/create", MedicalRecordsS.createRecord);
router.put("/update/:id", MedicalRecordsS.updateRecord);
router.delete("/delete/:id", MedicalRecordsS.deleteRecord);

module.exports = router;
