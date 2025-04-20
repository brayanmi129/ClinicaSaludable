const express = require("express");
const router = express.Router();
const DoctorsS = require("../services/doctorsS.js");
const verifyJWT = require("../middlewares/verifyJWT");

router.get("/all", DoctorsS.getDoctors);
router.get("/id/:id", DoctorsS.getDoctorsByID);
router.get("/email/:email", DoctorsS.getDoctorsByEmail);

module.exports = router;
