require("dotenv").config();

class AuthS {
  async OAuth(req, res) {
    try {
      const user = req.user;

      if (!user) {
        console.log("No se encontró el usuario en la DB.");
        return res.redirect(`${process.env.URL_BACKEND}/oauth-popup.html?token=Fail`);
      }
      return res.redirect(`${process.env.URL_BACKEND}/oauth-popup.html?token=Success`);
    } catch (error) {
      return res.redirect(`${process.env.URL_BACKEND}/oauth-popup.html?token=Fail`);
    }
  }

  async logOut(req, res) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }

      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Error al destruir la sesión" });
        }
        res.clearCookie("connect.sid");

        res.json({ message: "Sesión cerrada correctamente" });
      });
    });
  }
}

module.exports = new AuthS();
