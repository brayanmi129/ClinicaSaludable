const { getConnection, sql } = require("../controler/db");
const bcrypt = require("bcryptjs");

class UsersM {
  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(
        `
      SELECT 
        u.user_id, 
        u.first_name, 
        u.last_name, 
        u.address, 
        u.phone, 
        u.birth_date, 
        u.email, 
        u.role_name, 

        d.doctor_id,
        d.specialty,
        d.blood_type,

        p.patient_id,
        p.health_insurance,
        p.blood_type,
        p.allergies

      FROM T_Users u
      LEFT JOIN T_Doctors d ON u.user_id = d.user_id
      LEFT JOIN T_Patients p ON u.user_id = p.user_id
    `
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
          "SELECT user_id, first_name , last_name, address , phone,birth_date , email ,role_name FROM T_Users WHERE email = @email"
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
        .input("user_id", id)
        .query(
          `
      SELECT 
        u.user_id, 
        u.first_name, 
        u.last_name, 
        u.address, 
        u.phone, 
        u.birth_date, 
        u.email, 
        u.role_name, 

        d.doctor_id,
        d.specialty,
        d.blood_type,

        p.patient_id,
        p.health_insurance,
        p.blood_type,
        p.allergies

      FROM T_Users u
      LEFT JOIN T_Doctors d ON u.user_id = d.user_id
      LEFT JOIN T_Patients p ON u.user_id = p.user_id
    `
        );

      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw error;
    }
  }

  async getByRole(role) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("role_name", role)
        .query(
          "SELECT user_id, first_name , last_name, address , phone,birth_date , email ,role_name FROM T_Users WHERE role_name = @role_name"
        );

      return result.recordset;
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw error;
    }
  }

  async updateUserById(user_id, updatedFields) {
    if (updatedFields.password) {
      updatedFields.password = await bcrypt.hash(updatedFields.password, 10);
    }
    try {
      const allowedFields = [
        "first_name",
        "last_name",
        "address",
        "phone",
        "birth_date",
        "email",
        "password",
        "role_name",
      ];

      const optionalFields = [, "blood_type", "specialty", "health_insurance", "allergies"];

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

      request.input("user_id", user_id);

      const updateQuery = `
        UPDATE T_Users
        SET ${setClauses.join(", ")}
        WHERE user_id = @user_id
      `;

      await request.query(updateQuery);

      return { message: "Usuario actualizado correctamente." };
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  async deleteUserById(user_id) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("user_id", user_id)
        .query("DELETE FROM T_Users WHERE user_id = @user_id");

      return {
        success: result.rowsAffected[0] > 0,
        message:
          result.rowsAffected[0] > 0
            ? "Usuario eliminado correctamente."
            : "No se encontró un usuario con ese ID.",
      };
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  }

  async registerUser(userData) {
    const {
      first_name,
      last_name,
      address,
      phone,
      birth_date,
      email,
      password,
      blood_type,
      role_name,
      specialty,
      allergies,
      health_insurance,
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await getConnection();

    try {
      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      const request = new sql.Request(transaction);

      request.input("first_name", sql.VarChar(100), first_name);
      request.input("last_name", sql.VarChar(100), last_name);
      request.input("address", sql.Text, address);
      request.input("phone", sql.VarChar(20), phone);
      request.input("birth_date", sql.Date, birth_date);
      request.input("email", sql.VarChar(255), email);
      request.input("password", sql.Text, hashedPassword);
      request.input("role_name", sql.VarChar(20), role_name);

      const insertUserQuery = `
        INSERT INTO T_Users 
        (first_name, last_name, address, phone, birth_date, email, password, role_name)
        OUTPUT INSERTED.user_id
        VALUES (@first_name, @last_name, @address, @phone, @birth_date, @email, @password, @role_name)
      `;

      const result = await request.query(insertUserQuery);
      const user_id = result.recordset[0].user_id;

      // Insertar en tabla secundaria
      const roleReq = new sql.Request(transaction);
      roleReq.input("user_id", sql.Int, user_id);

      if (role_name === "DOCTOR") {
        roleReq.input("specialty", sql.VarChar(100), specialty);
        roleReq.input("blood_type", sql.VarChar(3), blood_type);

        await roleReq.query(
          `INSERT INTO T_Doctors (user_id, blood_type , specialty) VALUES (@user_id, @specialty, @blood_type)`
        );
      } else if (role_name === "PATIENT") {
        roleReq.input("health_insurance", sql.VarChar(100), health_insurance);
        roleReq.input("allergies", sql.Text, allergies);
        roleReq.input("blood_type", sql.VarChar(3), blood_type);

        await roleReq.query(
          `INSERT INTO T_Patients (user_id, health_insurance, allergies, blood_type) VALUES (@user_id, @health_insurance, @allergies , @blood_type)`
        );
      }

      await transaction.commit();

      console.log("Usuario Creado exitosamente", user_id, email, role_name);
      return {
        success: true,
        message: "Usuario creado exitosamente",
        user_id,
        email,
        role_name,
      };
    } catch (err) {
      console.error("Error al registrar:", err);
      return {
        success: false,
        message: "Error al registrar el usuario",
      };
    }
  }
}

module.exports = new UsersM();
