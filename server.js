const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./controler/passport");

const isproduction = process.env.NODE_ENV === "production";

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

// app.use(
//   session({
//     secret: "Clinica123",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: false,
//       secure: isproduction ? true : false, // En producción, secure debe ser true
//       sameSite: isproduction ? "none" : "lax", // En producción, sameSite debe ser "none"
//     },
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());

const userRoutes = require("./routes/usersRoutes");
const authRoutes = require("./routes/authRoutes");
const doctorsRoutes = require("./routes/doctorsRoutes");
const patientsRoutes = require("./routes/patientsRoutes");
const medicalRecordsRoutes = require("./routes/medicalRecordsRoutes");

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/doctors", doctorsRoutes);
app.use("/patients", patientsRoutes);
app.use("/medicalRecords", medicalRecordsRoutes);

//enpoint para solicitudes no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
