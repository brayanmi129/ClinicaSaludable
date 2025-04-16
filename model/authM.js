const crypto = require("crypto");
const UsersM = require("./userM.js");
const bcrypt = require("bcrypt");

class AuthM {
  async OAuth(profile) {
    const User = await UsersM.getByEmail(profile.emails[0].value);
    if (User) {
      return User;
    }
    return null;
  }

  async authLocal(email, password) {
    const user = await UsersM.getByEmail(email);
    if (!user) return { error: "Usuario no encontrado" };

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return { error: "Contraseña incorrecta" };

    return { user };
  }
}
module.exports = new AuthM();
