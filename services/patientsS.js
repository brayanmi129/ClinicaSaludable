const PatientsM = require("../model/patientsM");

class PatientsS {
  async getPatients(req, res) {
    try {
      const result = await PatientsM.getAll();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async getPatientsByID(req, res) {
    const { id } = req.params;
    try {
      const result = await PatientsM.getById(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async getPatientsByEmail(req, res) {
    const { email } = req.params;
    try {
      const result = await PatientsM.getByEmail(email);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
}

module.exports = new PatientsS();
