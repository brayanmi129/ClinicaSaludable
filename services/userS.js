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

  async getUsersByName(req, res) {
    const { name } = req.params;
    try {
      const result = await UsersM.getByName(name);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(result);
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
    console.log("ID en updateUserById", id);
    console.log("Campos a actualizar", updatedFields);

    try {
      console.log("entrando al try");
      const result = await UsersM.updateUserById(id, updatedFields);
      if (result.success) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(400).json({ message: result.message });
      }
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
    console.log(userData);
    try {
      const result = await userM.registerUser(userData);
      console.log(result);
      if (result.success) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: `Error en el servidor ${e}` });
    }
  }
}

module.exports = new UsersS();
