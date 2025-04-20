const express = require("express");
const router = express.Router();
const LaboratoriesS = require("../services/LaboratoriesS.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  upload.single("file"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    next();
  },
  LaboratoriesS.uploadLaboratorie
);

router.get("/all", LaboratoriesS.getLaboratories);
router.get("/id/:id", LaboratoriesS.getLaboratoriesByID);
router.get("/patient/:id", LaboratoriesS.getLaboratoriesByPatient);

module.exports = router;
