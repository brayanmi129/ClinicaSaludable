const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.port || 3000;

//midelwares
app.use(express.json());

//Rutas
const userRoutes = require("./routes/usersRoutes"); // Importa las rutas de usuarios

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes); // Usa el router de usuarios en la ruta /api/users

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
