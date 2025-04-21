const express = require("express");
const router = express.Router();
const LaboratoriesS = require("../services/LaboratoriesS.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const verifyJWT = require("../middlewares/verifyJWT");

router.post(
  "/create",
  verifyJWT,
  upload.single("file"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    next();
  },
  LaboratoriesS.uploadLaboratorie
);

router.get("/all", verifyJWT, LaboratoriesS.getLaboratories);
router.get("/id/:id", verifyJWT, LaboratoriesS.getLaboratoriesByID);
router.get("/patient/:id", verifyJWT, LaboratoriesS.getLaboratoriesByPatient);

router.put("/update/:id", verifyJWT, LaboratoriesS.updateLaboratories);
router.delete("/delete/:id", verifyJWT, LaboratoriesS.deleteLaboratories);

module.exports = router;
