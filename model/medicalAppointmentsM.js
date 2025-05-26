const { getConnection, sql } = require("../controler/db");
const { sendEmail } = require("../controler/emails");
const Users = require("./UserM");

class MedicalAppointmentsM {
  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT 
          A.appointment_id,
          A.appointment_type,
          A.appointment_date,
          A.appointment_time,
          A.location,
          A.status,
          PU.user_id AS patient_id,
          CONCAT(PU.first_name, ' ', PU.last_name) AS patient_name,
          DU.user_id AS doctor_id,
          CONCAT(DU.first_name, ' ', DU.last_name) AS doctor_name
        FROM T_MedicalAppointments A
        LEFT JOIN T_Users PU ON A.patient_id = PU.user_id
        LEFT JOIN T_Users DU ON A.doctor_id = DU.user_id;
      `);
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener citas médicas:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request().input(`appointment_id", id)
        .query(' SELECT 
        A.appointment_id,
        A.appointment_type,
        A.appointment_date,
        A.appointment_time,
        A.location,
        A.status,
        PU.user_id AS patient_id,
        CONCAT(PU.first_name, ' ', PU.last_name) AS patient_name,
        DU.user_id AS doctor_id,
        CONCAT(DU.first_name, ' ', DU.last_name) AS doctor_name
      FROM T_MedicalAppointments A
      LEFT JOIN T_Users PU ON A.patient_id = PU.user_id
      LEFT JOIN T_Users DU ON A.doctor_id = DU.user_id; WHERE appointment_id = @appointment_id;`);
      return result.recordsets[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw error;
    }
  }

  async getByPatient(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request().input("patient_id", sql.Int, id) // Usa comillas simples y pasa el tipo correctamente
        .query(`
          SELECT 
            A.appointment_id,
            A.appointment_type,
            A.appointment_date,
            A.appointment_time,
            A.location,
            A.status,
            PU.user_id AS patient_id,
            CONCAT(PU.first_name, ' ', PU.last_name) AS patient_name,
            DU.user_id AS doctor_id,
            CONCAT(DU.first_name, ' ', DU.last_name) AS doctor_name
          FROM T_MedicalAppointments A
          LEFT JOIN T_Users PU ON A.patient_id = PU.user_id
          LEFT JOIN T_Users DU ON A.doctor_id = DU.user_id
          WHERE PU.user_id = @patient_id
        `);
      return result.recordsets;
    } catch (error) {
      console.error(`Error al obtener las HC del usuario ${id}:`, error);
      return error;
    }
  }

  async getByDoctor(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request().input("doctor_id", id).query(` SELECT 
        A.appointment_id,
        A.appointment_type,
        A.appointment_date,
        A.appointment_time,
        A.location,
        A.status,
        PU.user_id AS patient_id,
        CONCAT(PU.first_name, ' ', PU.last_name) AS patient_name,
        DU.user_id AS doctor_id,
        CONCAT(DU.first_name, ' ', DU.last_name) AS doctor_name
      FROM T_MedicalAppointments A
      LEFT JOIN T_Users PU ON A.patient_id = PU.user_id
      LEFT JOIN T_Users DU ON A.doctor_id = DU.user_id; WHERE doctor_id = @doctor_id;`);
      return result.recordsets;
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

    const doctor = await Users.getById(doctor_id);
    const patient = await Users.getById(patient_id);
    if (doctor[0].role_name !== "DOCTOR")
      return { success: false, message: "El usuario no es un doctor" };
    if (patient[0].role_name !== "PATIENT")
      return { success: false, message: "El usuario no es un paciente" };

    try {
      const request = pool.request();

      request.input("patient_id", sql.Int, patient_id);
      request.input("doctor_id", sql.Int, doctor_id);
      request.input("appointment_type", sql.VarChar(100), appointment_type || null);
      request.input("appointment_date", sql.Date, appointment_date);
      // Crea un objeto Date usando solo la parte de la hora
      const [hours, minutes, seconds] = appointment_time.split(":");
      const appointmentTimeDate = new Date();
      appointmentTimeDate.setHours(Number(hours));
      appointmentTimeDate.setMinutes(Number(minutes));
      appointmentTimeDate.setSeconds(Number(seconds));

      // Y pásalo como Date, no como string
      request.input("appointment_time", sql.Time, appointmentTimeDate);
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

      const to = pacient[0].email;
      const name = pacient[0].first_name;
      const date = data.appointment_date;
      const time = data.appointment_time;
      const emaildata = { to, date, time, name };

      const emailresult = await sendEmail(emaildata);
      console.log(emailresult);

      if (emailresult) {
        return {
          success: true,
          message: "Cita médica creada exitosamente",
          appointment_id,
        };
      } else {
        return {
          success: false,
          message: "Cita médica creada exitosamente peor error en al enviar el correo",
          appointment_id,
        };
      }
    } catch (err) {
      console.error("Error al crear la cita médica:", err);
      return {
        success: false,
        message: "Error al crear la cita médica",
      };
    }
  }
  async update(appointment_id, updatedFields) {
    try {
      const allowedFields = [
        "patient_id",
        "doctor_id",
        "appointment_type",
        "appointment_date",
        "appointment_time",
        "location",
        "status",
      ];

      const setClauses = [];
      const inputs = [];

      // Recorremos los campos permitidos para ver si están en la actualización
      for (const field of allowedFields) {
        if (updatedFields[field] !== undefined) {
          setClauses.push(`${field} = @${field}`);
          inputs.push({ name: field, value: updatedFields[field] });
        }
      }

      if (setClauses.length === 0) {
        throw new Error("No se proporcionaron campos para actualizar.");
      }

      const pool = await getConnection();
      const request = pool.request();

      // Agregamos todos los valores de los campos que vamos a actualizar
      inputs.forEach(({ name, value }) => {
        request.input(name, value);
      });

      // Añadimos el parámetro para identificar la cita que se va a actualizar
      request.input("appointment_id", appointment_id);

      const updateQuery = `
        UPDATE T_MedicalAppointments
        SET ${setClauses.join(", ")}
        WHERE appointment_id = @appointment_id
      `;

      // Ejecutamos la consulta de actualización
      await request.query(updateQuery);

      return { message: "Cita médica actualizada correctamente." };
    } catch (error) {
      console.error("Error al actualizar la cita médica:", error);
      throw error;
    }
  }
}

module.exports = new MedicalAppointmentsM();
