const { getConnection, sql } = require("../controler/db");

class MedicalRecordsM {
  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query("SELECT * FROM T_MedicalRecords;");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("record_id", id)
        .query("SELECT * FROM T_MedicalRecords WHERE record_id = @record_id;");
      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw error;
    }
  }

  async getByPatient(id) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("patient_id", id)
        .query("SELECT * FROM T_MedicalRecords WHERE patient_id = @patient_id;");
      return result.recordset;
    } catch (error) {
      console.error(`Error al obtener las HC del usuario ${id}:`, error);
      throw error;
    }
  }

  async getByDoctr(id) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("doctor_id", id)
        .query("SELECT * FROM T_MedicalRecords WHERE doctor_id = @patient_id;");
      return result.recordset;
    } catch (error) {
      console.error(`Error al obtener las HC del usuario ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new MedicalRecordsM();
