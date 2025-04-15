const { getConnection, sql } = require("../controler/db");

class UsersM {
  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query("SELECT * FROM T_Users");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async getByEmail(email) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("email", email)
        .query("SELECT * FROM T_Users WHERE email = @email");

      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("user_id", id)
        .query("SELECT * FROM T_Users WHERE user_id = @user_id");

      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw error;
    }
  }

  async getByRole(role) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("role_name", role)
        .query("SELECT * FROM T_Users WHERE role_name = @role_name");

      return result.recordset;
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw error;
    }
  }

  async updateUserById(user_id, updatedFields) {
    try {
      const allowedFields = [
        "first_name",
        "last_name",
        "address",
        "phone",
        "birth_date",
        "email",
        "password_hash",
        "blood_type",
        "role_name",
      ];

      const setClauses = [];
      const inputs = [];

      for (const field of allowedFields) {
        if (field in updatedFields) {
          setClauses.push(`${field} = @${field}`);
          inputs.push({ name: field, value: updatedFields[field] });
        }
      }
      console.log("Clausessss", setClauses, "Inputsssss", inputs);

      if (setClauses.length === 0) {
        throw new Error("No se proporcionaron campos para actualizar.");
      }

      const pool = await getConnection();
      const request = pool.request();

      inputs.forEach(({ name, value }) => {
        request.input(name, value);
      });

      request.input("user_id", user_id);

      const updateQuery = `
        UPDATE T_Users
        SET ${setClauses.join(", ")}
        WHERE user_id = @user_id
      `;

      await request.query(updateQuery);
      return { message: "Usuario actualizado correctamente." };
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  async deleteUserById(user_id) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("user_id", user_id)
        .query("DELETE FROM T_Users WHERE user_id = @user_id");

      return {
        success: result.rowsAffected[0] > 0,
        message:
          result.rowsAffected[0] > 0
            ? "Usuario eliminado correctamente."
            : "No se encontró un usuario con ese ID.",
      };
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  }
}

module.exports = new UsersM();
