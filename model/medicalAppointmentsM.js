const { getConnection, sql } = require("../controler/db");

class MedicalAppointmentsM {
  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query("SELECT * FROM T_MedicalAppointments;");
      return result.recordsets[0];
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
        .query("SELECT * FROM T_MedicalAppointments WHERE record_id = @record_id;");
      return result.Appointmentset[0];
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
        .query("SELECT * FROM T_MedicalAppointments WHERE patient_id = @patient_id;");
      return result.Appointmentset;
    } catch (error) {
      console.error(`Error al obtener las HC del usuario ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new MedicalAppointmentsM();
