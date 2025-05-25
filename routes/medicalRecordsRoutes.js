const express = require("express");
const router = express.Router();
const MedicalRecordsS = require("../services/MedicalRecordsS.js");
const verifyJWT = require("../middlewares/verifyJWT");

router.get("/all", verifyJWT, MedicalRecordsS.getRecords);
router.get("/id/:id", verifyJWT, MedicalRecordsS.getRecordsByID);
router.get("/patient/:id", MedicalRecordsS.getRecordByPatient);
router.get("/me", MedicalRecordsS.getMyRecords);
router.post("/create", verifyJWT, MedicalRecordsS.createRecord);
router.put("/update/:id", verifyJWT, MedicalRecordsS.updateRecord);
router.delete("/delete/:id", verifyJWT, MedicalRecordsS.deleteRecord);

module.exports = router;
