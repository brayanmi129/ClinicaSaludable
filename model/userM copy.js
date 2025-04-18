const readline = require("readline");
const bcrypt = require("bcrypt");

// Función para preguntar desde consola
function preguntar(pregunta) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(pregunta, (respuesta) => {
      rl.close();
      resolve(respuesta);
    });
  });
}

// Función principal que pide la contraseña y la hashea
async function pedirYHashearPassword() {
  const password = await preguntar("Escribe tu contraseña: ");
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Contraseña hasheada:", hashedPassword);
}

// Llamar la función
pedirYHashearPassword();
