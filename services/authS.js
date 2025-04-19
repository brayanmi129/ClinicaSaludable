require("dotenv").config();
const jwt = require("jsonwebtoken");
const Auth = require("../model/AuthM.js");

class AuthS {
  async OAuth(req, res) {
    try {
      const user = req.user;
      if (!user) {
        console.log("No se encontró el usuario en la DB.");
        return res.redirect(`${process.env.URL_BACKEND}/oauth-popup.html?token=fail&satus=fail`);
      }

      const payload = {
        id: user.user_id,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      console.log("Token generado:", token);

      return res.send(`
        <html>
          <head>
            <title>OAuth Success</title>
            <script>
              const token = "${token}";
              window.opener.postMessage({ token, status: "Success" }, "http://localhost:5173");
              window.opener.postMessage({ token, status: "Success" }, "https://clinica-norte.azurewebsites.net");

              console.log("Token recibido:", token);

              setTimeout(() => {
                window.close();
              }, 500);
            </script>
          </head>
          <body>
            <p>Autenticando...</p>
          </body>
          
        </html>
      `);
    } catch (error) {
      return res.redirect(`${process.env.URL_BACKEND}/oauth-popup.html?token=fail&satus=fail`);
    }
  }

  async loginLocal(req, res) {
    console.log(req.body);
    try {
      const { email, password } = req.body;
      const result = await Auth.authLocal(email, password);
      if (result.error) {
        return res.status(401).json({ message: result.error });
      }
      const user = result.user;
      const payload = {
        id: user.user_id,
        email: user.email,
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
}

module.exports = new AuthS();
