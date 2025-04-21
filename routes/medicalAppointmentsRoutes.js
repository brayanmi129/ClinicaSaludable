const express = require("express");
const router = express.Router();
const MedicalApoimentsS = require("../services/MedicalAppointmentsS");

router.get("/all", MedicalApoimentsS.getAppointments);
router.get("/id/:id", MedicalApoimentsS.getAppoimentByID);
router.get("/patient/:id", MedicalApoimentsS.getAppointmentByPatient);
router.get("/doctor/:id", MedicalApoimentsS.getAppointmentByDoctor);

router.post("/create", MedicalApoimentsS.createAppointment);
router.put("/update/:id", MedicalApoimentsS.updateAppointment);

module.exports = router;
