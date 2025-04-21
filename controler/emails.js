const sgMail = require("@sendgrid/mail");

const key = process.env.APY_KEY_EMAILS;

sgMail.setApiKey(key);

const sendEmail = async (emailData) => {
  const { to, date, time, name } = emailData;

  const msg = {
    to, // destinatario
    from: "bmirandah@ucentral.edu.co",
    subject: "Tu cita ha sido agendada",
    text: `Hola ${name}, tu cita medica con clinica norte ha sido agendada para la fecha: ${date} a la hora: ${time} Gracias por confiar en nosotros.`,
    html: `<strong> Hola ${name}, tu cita ha sido agendada para la fecha: ${date} a la hora: ${time} Gracias por confiar en nosotros.</strong>`,
  };

  console.log("msg", msg);

  try {
    await sgMail.send(msg);

    console.log("Correo enviado exitosamente");
    return true;
  } catch (error) {
    console.error("Error al enviar el correo:", error.response?.body || error.message);
    return false;
  }
};

module.exports = { sendEmail };
