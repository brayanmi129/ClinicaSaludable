const doctorsM = require("../model/doctorsM");

class DoctorsS {
  async getDoctors(req, res) {
    try {
      const result = await doctorsM.getAll();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async getDoctorsByID(req, res) {
    const { id } = req.params;
    try {
      const result = await doctorsM.getById(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async getDoctorsByEmail(req, res) {
    const { email } = req.params;
    try {
      const result = await doctorsM.getByEmail(email);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
  async updateDoctorById(req, res) {
    const { id } = req.params;
    const updatedFields = req.body;
    try {
      const result = await DoctorsM.update(id, updatedFields);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
}

module.exports = new DoctorsS();
