const UsersM = require("./userM.js");
const bcrypt = require("bcryptjs");
const { getConnection, sql } = require("../controler/db");

class AuthM {
  async OAuth(profile) {
    const User = await UsersM.getByEmail(profile.emails[0].value);
    if (User) {
      return User;
    }
    return null;
  }

  async authLocal(email, password) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query("SELECT * FROM T_Users WHERE email = @email;");
      const user = result.recordset[0];
      if (!user) return { error: "Usuario no encontrado" };
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return { error: "Contraseña incorrecta" };

      return { user };
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = new AuthM();
