const sql = require("mssql");
require("dotenv").config();

// Configuración de la conexión
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,

  options: {
    encrypt: true, // Necesario si usas Azure
    trustServerCertificate: true, // Cambia a true si no tienes un certificado válido
  },
};

// Función para obtener la conexión a la base de datos
let poolPromise;

async function getConnection() {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

module.exports = {
  getConnection,
  sql,
};
