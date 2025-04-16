const userM = require("../model/userM");
const UsersM = require("../model/userM");

class UsersS {
  async getUsers(req, res) {
    try {
      const result = await UsersM.getAll();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async getUsersByID(req, res) {
    const { id } = req.params;
    try {
      const result = await UsersM.getById(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async getUsersByEmail(req, res) {
    const { email } = req.params;
    try {
      const result = await UsersM.getByEmail(email);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result); // Enviamos solo el usuario encontrado
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async getUsersByRole(req, res) {
    const { role } = req.params;
    try {
      const result = await UsersM.getByRole(role);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async updateUserById(req, res) {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
      const result = await UsersM.updateUserById(id, updatedFields);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result); // Enviamos el usuario actualizado
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async deleteUserById(req, res) {
    const { id } = req.params;
    try {
      const result = await userM.deleteUserById(id);
      if (result.success) {
        res.status(200).json({ message: `Usuario ${id} eliminado exitosamente` });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  async registrerUser(req, res) {
    const userData = req.body;
    try {
      const result = await userM.registerUser(userData);
      if (result.success) {
        res.status(200).json({ message: `Usuario ${id} eliminado exitosamente` });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
}

module.exports = new UsersS();
