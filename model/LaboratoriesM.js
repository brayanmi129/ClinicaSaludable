const { getConnection, sql } = require("../controler/db");
const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();
const UserM = require("./UserM");

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

class LaboratoriesM {
  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .query(
          "SELECT L.lab_id, L.lab_name, L.lab_date, L.exam_date, L.file_link, CONCAT(PU.first_name, ' ', PU.last_name) AS patient_name, CONCAT(DU.first_name, ' ', DU.last_name) AS doctor_name FROM T_Laboratories L INNER JOIN T_Patients P ON L.patient_id = P.patient_id INNER JOIN T_Users PU ON P.user_id = PU.user_id INNER JOIN T_Doctors D ON L.doctor_id = D.doctor_id INNER JOIN T_Users DU ON D.user_id = DU.user_id;"
        );
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
        .input("patient_id", sql.Int, id)
        .query(
          "SELECT L.lab_id, L.lab_name, L.lab_date, L.exam_date, L.file_link, CONCAT(PU.first_name, ' ', PU.last_name) AS patient_name, CONCAT(DU.first_name, ' ', DU.last_name) AS doctor_name FROM T_Laboratories L INNER JOIN T_Patients P ON L.patient_id = P.patient_id INNER JOIN T_Users PU ON P.user_id = PU.user_id INNER JOIN T_Doctors D ON L.doctor_id = D.doctor_id INNER JOIN T_Users DU ON D.user_id = DU.user_id WHERE L.lab_id = 10;"
        );
      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  }

  async getByPatient(id) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("patient_id", sql.Int, id)
        .query(
          "SELECT L.lab_id, L.lab_name, L.lab_date, L.exam_date, L.file_link, CONCAT(PU.first_name, ' ', PU.last_name) AS patient_name, CONCAT(DU.first_name, ' ', DU.last_name) AS doctor_name FROM T_Laboratories L INNER JOIN T_Patients P ON L.patient_id = P.patient_id INNER JOIN T_Users PU ON P.user_id = PU.user_id INNER JOIN T_Doctors D ON L.doctor_id = D.doctor_id INNER JOIN T_Users DU ON D.user_id = DU.user_id WHERE L.patient_id  = @patient_id "
        );
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  }

  async upload(data, file) {
    const { labName, labDate, patient_id, doctor_id } = data;
    const user = await UserM.getById(patient_id);
    const { email } = user;
    try {
      const blobName = `${email}/${file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      const file_link = blockBlobClient.url + process.env.SAS_TOKEN;

      const pool = await getConnection();
      await pool
        .request()
        .input("labName", sql.VarChar, labName)
        .input("labDate", sql.Date, labDate)
        .input("fileLink", sql.Text, file_link)
        .input("patientId", sql.Int, patient_id)
        .input("doctorId", sql.Int, doctor_id)
        .query(
          `INSERT INTO T_Laboratories (lab_name, lab_date, file_link, patient_id, doctor_id)
         VALUES (@labName, @labDate, @fileLink, @patientId, @doctorId);`
        );

      return { message: "Laboratorio subido correctamente" };
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }
}

module.exports = new LaboratoriesM();
