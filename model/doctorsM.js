const { getConnection, sql } = require("../controler/db");
const bcrypt = require("bcryptjs");

class DoctorsM {
  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .query(
          "SELECT u.user_id, d.doctor_id, u.first_name, u.last_name, u.email, d.specialty FROM T_Users u INNER JOIN T_Doctors d ON u.user_id = d.user_id;"
        );
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async getByEmail(email) {
    console.log("Email", email);
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("email", email)
        .query(
          "SELECT u.user_id, d.doctor_id, u.first_name, u.last_name, u.email, d.specialty FROM T_Users u INNER JOIN T_Doctors d ON u.user_id = d.user_id WHERE u.email = @email;"
        );

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
        .input("DoctorId", id)
        .query(
          "SELECT u.user_id, d.doctor_id, u.first_name, u.last_name, u.email, d.specialty FROM T_Users u INNER JOIN T_Doctors d ON u.user_id = d.user_id WHERE d.doctor_id = @DoctorId"
        );

      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw error;
    }
  }
  async update(doctor_id, updatedFields) {
    try {
      const allowedFields = ["specialty"];

      const setClauses = [];
      const inputs = [];

      for (const field of allowedFields) {
        if (field in updatedFields) {
          setClauses.push(`${field} = @${field}`);
          inputs.push({ name: field, value: updatedFields[field] });
        }
      }

      if (setClauses.length === 0) {
        throw new Error("No se proporcionaron campos para actualizar.");
      }

      const pool = await getConnection();
      const request = pool.request();

      inputs.forEach(({ name, value }) => {
        request.input(name, value);
      });

      request.input("doctor_id", doctor_id);

      const updateQuery = `
        UPDATE T_Doctors
        SET ${setClauses.join(", ")}
        WHERE doctor_id = @doctor_id
      `;

      await request.query(updateQuery);
      return { message: "Doctor actualizado correctamente." };
    } catch (error) {
      console.error("Error al actualizar doctor:", error);
      throw error;
    }
  }
}

module.exports = new DoctorsM();
