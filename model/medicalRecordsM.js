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

  async create(data) {
    try {
      const { patient_id, doctor_id, diagnosis_date, observations, incapacidad, medicamentos } =
        data;

      const pool = await getConnection();
      const result = await pool
        .request()
        .input("patient_id", patient_id)
        .input("doctor_id", doctor_id || null) // doctor_id puede ser null
        .input("diagnosis_date", diagnosis_date)
        .input("observations", observations)
        .input("incapacidad", incapacidad || null) // incapacidad puede ser null
        .input("medicamentos", medicamentos || null) // medicamentos puede ser null
        .query(`
        INSERT INTO T_MedicalRecords (patient_id, doctor_id, diagnosis_date, observations, incapacidad, medicamentos)
        VALUES (@patient_id, @doctor_id, @diagnosis_date, @observations, @incapacidad, @medicamentos);
      `);

      return { message: "Registro médico creado exitosamente" };
    } catch (error) {
      console.error("Error al crear el registro médico:", error);
      throw error;
    }
  }
  async update(record_id, updatedFields) {
    try {
      // Campos permitidos para actualizar
      const allowedFields = [
        "diagnosis_date",
        "observations",
        "incapacidad",
        "medicamentos",
        "doctor_id",
      ];

      const setClauses = [];
      const inputs = [];

      // Construcción dinámica de los setClauses basados en los campos proporcionados
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

      // Agregar los valores a la consulta
      inputs.forEach(({ name, value }) => {
        request.input(name, value);
      });

      // Agregar el ID del registro médico
      request.input("record_id", record_id);

      // Consulta de actualización
      const updateQuery = `
        UPDATE T_MedicalRecords
        SET ${setClauses.join(", ")}
        WHERE record_id = @record_id
      `;

      await request.query(updateQuery);
      return { message: "Registro médico actualizado correctamente." };
    } catch (error) {
      console.error("Error al actualizar el registro médico:", error);
      throw error;
    }
  }
  async delete(id) {
    try {
      const pool = await getConnection();
      const request = pool.request();

      // Parámetro para la consulta
      request.input("record_id", id);

      // Consulta de eliminación
      const deleteQuery = `
        DELETE FROM T_MedicalRecords
        WHERE record_id = @record_id
      `;

      const result = await request.query(deleteQuery);

      // Verificar si se eliminó algún registro
      if (result.rowsAffected[0] === 0) {
        throw new Error("No se encontró el registro médico para eliminar.");
      }

      return { message: "Registro médico eliminado correctamente." };
    } catch (error) {
      console.error("Error al eliminar el registro médico:", error);
      throw error;
    }
  }
}

module.exports = new MedicalRecordsM();
