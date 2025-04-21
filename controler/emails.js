const nodemailer = require("nodemailer");

const sendEmail = async (emailDat) => {
  const { to, date, time } = emailDat;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bmirandah@ucentral.edu.co",
      pass: "Danger#09c",
    },
  });

  const mailOptions = {
    from: "bmirandah@ucentral.edu.co",
    to,
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
