const { getConnection, sql } = require("../controler/db");
const { sendEmail } = require("../controler/emails");
const PatientsM = require("./patientsM");

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
      return result.recordsets[0];
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

      const pacient = await PatientsM.getById(data.patient_id);
      const to = pacient.email;
      const date = data.appointment_date;
      const time = data.appointment_time;
      const emaildata = { to, date, time };

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
      throw new Error("No se pudo crear la cita médica");
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
