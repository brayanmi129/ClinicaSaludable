require("dotenv").config();
const jwt = require("jsonwebtoken");
const Auth = require("../model/AuthM.js");
const User = require("../model/UserM.js");

class AuthS {
  async OAuth(req, res) {
    console.log("Callback de autenticación");
    console.log("Usuario autenticado:", req.user);
    try {
      const user = req.user[0];
      console.log("Usuario autenticado:", user);
      if (!user) {
        console.log("No se encontró el usuario en la DB.");
        return res.redirect(`${process.env.URL_FRONT}/?token=fail`);
      }

      const payload = {
        id: user.user_id,
        email: user.email,
        role: user.role_name,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      console.log("Token generado:", token);
      return res.redirect(`${process.env.URL_FRONT}/?token=${token}`);
    } catch (error) {
      return res.redirect(`${process.env.URL_FRONT}/?token=fail`);
    }
  }

  async loginLocal(req, res) {
    console.log(req.body);
    try {
      const { email, password } = req.body;
      const result = await Auth.authLocal(email, password);
      console.log("Resultado de la autenticación local:", result);
      if (result.error) {
        return res.status(401).json({ message: result.error });
      }
      const user = result;
      const payload = {
        id: user.user_id,
        email: user.email,
        role: user.role_name,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
      console.log("Token generado:", token);
      return res.json({ token });
    } catch (e) {
      return res.status(500).json({ message: "Error al iniciar sesión" });
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

  async me(req, res) {
    console.log("Me", req.user);
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      const id = req.user.id;
      console.log("ID", id);
      const userinfo = await User.getById(id);
      console.log("UserInfo", userinfo);
      res.json(userinfo[0]);
    }
  }
}

module.exports = new AuthS();
