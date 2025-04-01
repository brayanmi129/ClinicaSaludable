const { sql, getConnection } = require("../controlador/db");

class UserManagment {
  async getUsers(req, res) {
    try {
      const pool = await getConnection();
      const result = await pool.request().query("SELECT * FROM T_Users");
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }
}

module.exports = new UserManagment();
