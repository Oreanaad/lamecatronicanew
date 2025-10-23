// src/routes/contact.js
import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.post("/", async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  try {
    // Configurar transporte (SMTP de Gmail o tu servidor)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // si usas Gmail
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER, // tu email
        pass: process.env.MAIL_PASS  // contraseña o App Password
      }
    });

    // Definir contenido del mail
    await transporter.sendMail({
      from: `"Contacto Web" <${process.env.MAIL_USER}>`,
      to: "tudestino@empresa.com", // destinatario real
      subject: "Nuevo mensaje desde el formulario",
      html: `
        <h3>Nuevo mensaje desde el formulario</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
      `
    });

    res.json({ ok: true, msg: "Correo enviado correctamente" });
  } catch (err) {
    console.error("Error enviando correo:", err);
    res.status(500).json({ ok: false, msg: "Error al enviar el correo" });
  }
});

export default router;
