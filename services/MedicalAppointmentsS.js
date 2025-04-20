const medicalAppointmentsM = require("../model/medicalAppointmentsM");

class MedicalRecordsS {
  async getAppointments(req, res) {
    try {
      const result = await medicalAppointmentsM.getAll();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async getAppoimentByID(req, res) {
    const { id } = req.params;
    try {
      const result = await medicalAppointmentsM.getById(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async getAppointmentByPatient(req, res) {
    const { id } = req.params;
    try {
      const result = await medicalAppointmentsM.getByPatient(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
  async getAppointmentByDoctor(req, res) {
    const { id } = req.params;
    try {
      const result = await medicalAppointmentsM.getByDoctor(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async createAppointment(req, res) {
    const appointmentData = req.body;
    try {
      const result = await medicalAppointmentsM.create(appointmentData);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al crear la cita:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
}

module.exports = new MedicalRecordsS();
