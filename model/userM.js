const { getConnection, sql } = require("../controler/db");
const bcrypt = require("bcrypt");

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

  async registerUser(userData) {
    const {
      first_name,
      last_name,
      address,
      phone,
      birth_date,
      email,
      password,
      blood_type,
      role_name,
      extraData,
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await getConnection();

    try {
      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      const request = new sql.Request(transaction);

      request.input("first_name", sql.VarChar(100), first_name);
      request.input("last_name", sql.VarChar(100), last_name);
      request.input("address", sql.Text, address);
      request.input("phone", sql.VarChar(20), phone);
      request.input("birth_date", sql.Date, birth_date);
      request.input("email", sql.VarChar(255), email);
      request.input("password_hash", sql.Text, hashedPassword);
      request.input("blood_type", sql.VarChar(10), blood_type);
      request.input("role_name", sql.VarChar(20), role_name);

      const insertUserQuery = `
        INSERT INTO T_Users 
        (first_name, last_name, address, phone, birth_date, email, password_hash, blood_type, role_name)
        OUTPUT INSERTED.user_id
        VALUES (@first_name, @last_name, @address, @phone, @birth_date, @email, @password_hash, @blood_type, @role_name)
      `;

      const result = await request.query(insertUserQuery);
      const user_id = result.recordset[0].user_id;

      // Insertar en tabla secundaria
      const roleReq = new sql.Request(transaction);
      roleReq.input("user_id", sql.Int, user_id);

      if (role_name === "DOCTOR") {
        roleReq.input("specialty", sql.VarChar(100), extraData.specialty);
        await roleReq.query(
          `INSERT INTO T_Doctors (user_id, specialty) VALUES (@user_id, @specialty)`
        );
      } else if (role_name === "PATIENT") {
        roleReq.input("health_insurance", sql.VarChar(100), extraData.health_insurance);
        roleReq.input("allergies", sql.Text, extraData.allergies);
        await roleReq.query(
          `INSERT INTO T_Patients (user_id, health_insurance, allergies) VALUES (@user_id, @health_insurance, @allergies)`
        );
      }

      await transaction.commit();

      console.log("Usuario Creado exitosamente", user_id, email, role_name);
      return { user_id, email, role: role_name };
    } catch (err) {
      console.error("Error al registrar:", err);
      throw new Error("Error al registrar usuario");
    }
  }
}

module.exports = new UsersM();
