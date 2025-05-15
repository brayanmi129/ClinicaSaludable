const { getConnection, sql } = require("../controler/db");
const bcrypt = require("bcryptjs");

class PatientsM {
  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .query(
          "SELECT u.user_id, u.first_name, u.last_name, u.email, p.health_insurance, p.allergies , p.blood_type FROM T_Users u INNER JOIN T_Patients p ON u.user_id = p.user_id;"
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
          "SELECT u.user_id, u.first_name, u.last_name, u.email, p.health_insurance, p.allergies p.blood_type, FROM T_Users u INNER JOIN T_Patients p ON u.user_id = p.user_id WHERE u.email = @email;"
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
          "SELECT u.user_id, p.patient_id, u.first_name, u.last_name, u.email, p.health_insurance, p.allergies, p.blood_type FROM T_Users u INNER JOIN T_Patients p ON u.user_id = p.user_id WHERE p.patient_id = @PatientId;"
        );

      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw error;
    }
  }

  async update(patient_id, updatedFields) {
    try {
      const allowedFields = ["health_insurance", "allergies", "blood_type"];

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

      request.input("patient_id", patient_id);

      const updateQuery = `
        UPDATE T_Patients
        SET ${setClauses.join(", ")}
        WHERE patient_id = @patient_id
      `;

      await request.query(updateQuery);
      return { message: "Paciente actualizado correctamente." };
    } catch (error) {
      console.error("Error al actualizar paciente:", error);
      throw error;
    }
  }
}

module.exports = new PatientsM();
