const { getConnection, sql } = require("../controler/db");
const bcrypt = require("bcryptjs");

class PatientsM {
  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .query(
          "SELECT u.user_id, p.patient_id, u.first_name, u.last_name, u.email, p.health_insurance, p.allergies FROM T_Users u INNER JOIN T_Patients p ON u.user_id = p.user_id;"
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
          "SELECT u.user_id, p.patient_id, u.first_name, u.last_name, u.email, p.health_insurance, p.allergies FROM T_Users u INNER JOIN T_Patients p ON u.user_id = p.user_id WHERE u.email = @email;"
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
        .input("PatientId", id)
        .query(
          "SELECT u.user_id, p.patient_id, u.first_name, u.last_name, u.email, p.health_insurance, p.allergies FROM T_Users u INNER JOIN T_Patients p ON u.user_id = p.user_id WHERE p.patient_id = @PatientId;"
        );

      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw error;
    }
  }
}

module.exports = new PatientsM();
