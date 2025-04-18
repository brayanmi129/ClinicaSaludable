const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./controler/passport");

const PORT = process.env.PORT || 3000;

//midelwares
app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://clinica-del-norte.azurewebsites.net",
      "https://clinica-norte.azurewebsites.net",
    ],
    credentials: true,
  })
);

app.use(
  session({
    secret: "Clinica123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: process.env.SECURE,
      sameSite: process.env.SAME_SITE,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require("./routes/usersRoutes"); // Importa las rutas de usuarios
const authRoutes = require("./routes/authRoutes"); // Importa las rutas de autenticación

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/users", userRoutes); // Usa el router de usuarios en la ruta /api/users
app.use("/auth", authRoutes); // Usa el router de autenticación en la ruta /api/auth

//enpoint para solicitudes no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
