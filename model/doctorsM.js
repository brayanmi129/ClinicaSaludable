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
}

module.exports = new DoctorsM();
