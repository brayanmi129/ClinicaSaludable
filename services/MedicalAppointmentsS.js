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
      if (!result || result.success === false) {
        return res.status(400).json(result);
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      console.error("Error al crear la cita:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
  async updateAppointment(req, res) {
    const { id } = req.params;
    const appointmentData = req.body;
    try {
      const result = await medicalAppointmentsM.update(id, appointmentData);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
  async getMyAppointments(req, res) {
    console.log(req.user);
    const { id, role } = req.user;
    console.log(id);
    try {
      if (role === "doctor") {
        const result = await medicalAppointmentsM.getByDoctor(id);
        if (!result) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(result);
      }
      if (role === "pacient") {
        const result = await medicalAppointmentsM.getByPatient(id);
        if (!result) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(result);
      } else {
        return res.status(403).json({ message: "Un Administrador no tiene esa informacion" });
      }

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener las citas del usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
}

module.exports = new MedicalRecordsS();
