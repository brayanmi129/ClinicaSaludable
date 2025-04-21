const express = require("express");
const router = express.Router();
const MedicalApoimentsS = require("../services/MedicalAppointmentsS");
const verifyJWT = require("../middlewares/verifyJWT");

router.get("/all", verifyJWT, MedicalApoimentsS.getAppointments);
router.get("/id/:id", verifyJWT, MedicalApoimentsS.getAppoimentByID);
router.get("/patient/:id", verifyJWT, MedicalApoimentsS.getAppointmentByPatient);
router.get("/doctor/:id", verifyJWT, MedicalApoimentsS.getAppointmentByDoctor);

router.post("/create", verifyJWT, MedicalApoimentsS.createAppointment);
router.put("/update/:id", verifyJWT, MedicalApoimentsS.updateAppointment);

module.exports = router;
