const medicalRecordsM = require("../model/medicalRecordsM");

class MedicalRecordsS {
  async getRecords(req, res) {
    try {
      const result = await medicalRecordsM.getAll();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async getRecordsByID(req, res) {
    const { id } = req.params;
    try {
      const result = await medicalRecordsM.getById(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async getRecordByPatient(req, res) {
    const { id } = req.params;
    try {
      const result = await medicalRecordsM.getByPatient(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async getRecordByDoctort(req, res) {
    const { id } = req.params;
    try {
      const result = await medicalRecordsM.getByPatient(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener hc:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async createRecord(req, res) {
    const data = req.body;
    try {
      const result = await medicalRecordsM.create(data);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error al crear la HC:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async updateRecord(req, res) {
    const { id } = req.params;
    const data = req.body;
    try {
      const result = await medicalRecordsM.update(id, data);

      if (!result) {
        return res.status(404).json({ message: "HC no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al actualizar la HC:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
  async deleteRecord(req, res) {
    const { id } = req.params;
    try {
      const result = await medicalRecordsM.delete(id);

      if (!result) {
        return res.status(404).json({ message: "HC no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al eliminar la HC:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
}

module.exports = new MedicalRecordsS();
