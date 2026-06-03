const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
const PORT = 3001;

const transporter = nodemailer.createTransport({
  host: "host11.registrar-servers.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@dentistareforma.com",
    pass: "dentistaReforma#2025",
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("Error de conexión SMTP:", error);
  } else {
    console.log("Servidor SMTP listo para enviar correos");
  }
});

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "clinicareforma_admin",
  password: "{+kJ!(3?I[ky",
  database: "clinicareforma_contacts",
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    process.exit(1);
  } else {
    console.log("Conexión a la base de datos establecida");
  }
});

app.get("/api/citas/ocupadas", (req, res) => {
  connection.query(
    "SELECT fecha, hora FROM citas_dentistareforma ORDER BY fecha, hora",
    (err, results) => {
      if (err) {
        console.error("Error al obtener citas:", err);
        return res.status(500).json({ error: "Error al obtener citas" });
      }
      res.json(results);
    }
  );
});

app.post("/api/citas/agendar", (req, res) => {
  const { nombre_paciente, correo, telefono, fecha, hora } = req.body;

  if (!nombre_paciente || !telefono || !fecha || !hora) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  connection.query(
    "SELECT id FROM citas_dentistareforma WHERE fecha = ? AND hora = ?",
    [fecha, hora],
    (err, results) => {
      if (err) {
        console.error("Error al verificar cita:", err);
        return res.status(500).json({ error: "Error al verificar disponibilidad" });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "Cita no disponible" });
      }

      connection.query(
        "INSERT INTO citas_dentistareforma (nombre_paciente, correo, telefono, fecha, hora) VALUES (?, ?, ?, ?, ?)",
        [nombre_paciente, correo, telefono, fecha, hora],
        (err, result) => {
          if (err) {
            console.error("Error al insertar cita:", err);
            return res.status(500).json({ error: "Error al agendar cita" });
          }

          const mailOptions = {
            from: '"Dental Reforma" <info@dentistareforma.com>',
            to: correo || "info@dentistareforma.com",
            cc: "pacientes@dentistareforma.com",
            subject: "Confirmación de cita - Dental Reforma",
            html: `
              <h2>¡Cita agendada correctamente!</h2>
              <p><strong>Paciente:</strong> ${nombre_paciente}</p>
              <p><strong>Teléfono:</strong> ${telefono}</p>
              <p><strong>Correo:</strong> ${correo || "No proporcionado"}</p>
              <p><strong>Fecha:</strong> ${fecha}</p>
              <p><strong>Hora:</strong> ${hora}</p>
              <p>Gracias por confiar en Dental Reforma.</p>
            `,
          };

          transporter.sendMail(mailOptions, (mailErr, info) => {
            if (mailErr) {
              console.error("Error al enviar correo:", mailErr);
            } else {
              console.log("Correo enviado:", info.messageId);
            }
          });

          res.status(201).json({
            success: true,
            message: "Cita agendada correctamente",
            id: result.insertId,
          });
        }
      );
    }
  );
});

app.post("/api/citas/agendar-en", (req, res) => {
  const { nombre_paciente, correo, telefono, fecha, hora } = req.body;

  if (!nombre_paciente || !telefono || !fecha || !hora) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  connection.query(
    "SELECT id FROM citas_dentistareforma WHERE fecha = ? AND hora = ?",
    [fecha, hora],
    (err, results) => {
      if (err) {
        console.error("Error al verificar cita:", err);
        return res.status(500).json({ error: "Error verifying availability" });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "Appointment not available" });
      }

      connection.query(
        "INSERT INTO citas_dentistareforma (nombre_paciente, correo, telefono, fecha, hora) VALUES (?, ?, ?, ?, ?)",
        [nombre_paciente, correo, telefono, fecha, hora],
        (err, result) => {
          if (err) {
            console.error("Error al insertar cita:", err);
            return res.status(500).json({ error: "Error booking appointment" });
          }

          const mailOptions = {
            from: '"Dental Reforma" <info@dentistareforma.com>',
            to: correo || "info@dentistareforma.com",
            cc: "pacientes@dentistareforma.com",
            subject: "Appointment Confirmation - Dental Reforma",
            html: `
              <h2>Appointment booked successfully!</h2>
              <p><strong>Patient:</strong> ${nombre_paciente}</p>
              <p><strong>Phone:</strong> ${telefono}</p>
              <p><strong>Email:</strong> ${correo || "Not provided"}</p>
              <p><strong>Date:</strong> ${fecha}</p>
              <p><strong>Time:</strong> ${hora}</p>
              <p>Thank you for trusting Dental Reforma.</p>
            `,
          };

          transporter.sendMail(mailOptions, (mailErr, info) => {
            if (mailErr) {
              console.error("Error al enviar correo:", mailErr);
            } else {
              console.log("Correo enviado:", info.messageId);
            }
          });

          res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            id: result.insertId,
          });
        }
      );
    }
  );
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
