const crypto = require("crypto");
const UsersM = require("./userM.js");

class AuthM {
  async OAuth(profile) {
    const User = await UsersM.getByEmail(profile.emails[0].value);
    if (User) {
      return User;
    }
    return null;
  }
}
module.exports = new AuthM();
