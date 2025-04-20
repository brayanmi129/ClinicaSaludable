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
        .input("appointment_id", id)
        .query("SELECT * FROM T_MedicalAppointments WHERE appointment_id = @appointment_id;");
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

  async getByDoctor(id) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("doctor_id", id)
        .query("SELECT * FROM T_MedicalAppointments WHERE doctor_id = @doctor_id;");
      return result.Appointmentset;
    } catch (error) {
      console.error(`Error al obtener las las citas del usuario ${id}:`, error);
      throw error;
    }
  }

  async create(data) {
    const {
      patient_id,
      doctor_id,
      appointment_type,
      appointment_date,
      appointment_time,
      location,
      status,
    } = data;

    const pool = await getConnection();

    try {
      const request = pool.request();

      request.input("patient_id", sql.Int, patient_id);
      request.input("doctor_id", sql.Int, doctor_id);
      request.input("appointment_type", sql.VarChar(100), appointment_type || null);
      request.input("appointment_date", sql.Date, appointment_date);
      request.input("appointment_time", sql.Time, appointment_time);
      request.input("location", sql.Text, location || null);
      request.input("status", sql.VarChar(20), status);

      const insertQuery = `
        INSERT INTO T_MedicalAppointments 
        (patient_id, doctor_id, appointment_type, appointment_date, appointment_time, location, status)
        OUTPUT INSERTED.appointment_id
        VALUES (@patient_id, @doctor_id, @appointment_type, @appointment_date, @appointment_time, @location, @status)
      `;

      const result = await request.query(insertQuery);
      const appointment_id = result.recordset[0].appointment_id;

      return {
        success: true,
        message: "Cita médica creada exitosamente",
        appointment_id,
      };
    } catch (err) {
      console.error("Error al crear la cita médica:", err);
      throw new Error("No se pudo crear la cita médica");
    }
  }
}

module.exports = new MedicalAppointmentsM();
