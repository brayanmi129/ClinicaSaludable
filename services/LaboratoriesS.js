const LaboratoriesM = require("../model/LaboratoriesM");

class MedicalRecordsS {
  async getLaboratories(req, res) {
    try {
      const result = await LaboratoriesM.getAll();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async getLaboratoriesByID(req, res) {
    const { id } = req.params;
    try {
      const result = await LaboratoriesM.getById(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async getLaboratoriesByPatient(req, res) {
    const { id } = req.params;
    try {
      const result = await LaboratoriesM.getByPatient(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async uploadLaboratorie(req, res) {
    try {
      const data = req.body;
      const file = req.file;
      const result = await LaboratoriesM.upload(data, file);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }
}

module.exports = new MedicalRecordsS();
