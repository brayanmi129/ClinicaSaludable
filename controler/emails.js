const nodemailer = require("nodemailer");

const sendEmail = async (emailDat) => {
  const { to, date, time } = emailDat;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bmirandah@ucentral.edu.co", // Tu correo de Gmail
      pass: "Danger#09c", // Si usas autenticación de 2 pasos, necesitarás una contraseña de aplicación
    },
  });

  const mailOptions = {
    from: "tu-correo@gmail.com", // Tu correo de Gmail
    to, // Correo del destinatario
    subject: "Tu cita ha sido agendada",
    text: `Hola ${to}, tu cita ha sido agendada para la fecha: ${date} a la hora: ${time}.`,
    html: `<strong>Hola ${to}, tu cita ha sido agendada para la fecha: ${date} a la hora: ${time}.</strong>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

module.exports = { sendEmail };
