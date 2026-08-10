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

// ─── Datos del consultorio ────────────────────────────────────────────────────

const CLINIC_ADDRESS = "Av. Paseo Reforma 5304, La Esperanza, 22186 Tijuana, B.C.";
const CLINIC_ADDRESS_ICS = CLINIC_ADDRESS.replace(/,/g, "\\,");
const CLINIC_PHONE_TEXT = "+52 (663) 199 5492";
const CLINIC_PHONE_TEL = "+526631995492";
const CLINIC_LOGO_URL = "https://dentalreforma.com/images/logonuevo.png";

// ─── Helpers de fecha/hora ─────────────────────────────────────────────────────

function fechaES(f) {
  const m = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
             "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const p = f.split("-");
  return parseInt(p[2]) + " de " + m[parseInt(p[1]) - 1] + " de " + p[0];
}

function fechaEN(f) {
  const m = ["January", "February", "March", "April", "May", "June",
             "July", "August", "September", "October", "November", "December"];
  const p = f.split("-");
  return m[parseInt(p[1]) - 1] + " " + parseInt(p[2]) + ", " + p[0];
}

function hora12(h) {
  const n = parseInt(h.split(":")[0]);
  return (n % 12 || 12) + ":00 " + (n >= 12 ? "PM" : "AM");
}

function ics(nombre, fecha, hora, lang) {
  const p = fecha.split("-"), hp = hora.split(":");
  const start = new Date(+p[0], +p[1] - 1, +p[2], +hp[0] - 4, +hp[1]);
  const end = new Date(start.getTime() + 1800000);
  const fmt = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15);
  const summ = lang === "ES" ? "Cita Dental con " : "Dental Appointment with ";
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0",
    "BEGIN:VEVENT",
    "UID:" + Date.now() + "@dentalreforma.com",
    "DTSTAMP:" + fmt(new Date()),
    "DTSTART:" + fmt(start),
    "DTEND:" + fmt(end),
    "SUMMARY:" + summ + nombre,
    "LOCATION:" + CLINIC_ADDRESS_ICS,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

// Plantilla de confirmación de cita — mismo diseño que reformadental.com,
// adaptada a los datos y colores de Dental Reforma (dentalreforma.com).
// lang: "ES" | "EN"
function confirmationHtml(lang, nombre, fecha, hora, telefono) {
  const isES = lang === "ES";

  const fechaFmt = isES ? fechaES(fecha) : fechaEN(fecha);
  const horaFmt = hora12(hora);
  const preheader = isES
    ? `Tu cita está confirmada para el ${fechaFmt} a las ${horaFmt} — Dental Reforma, Tijuana.`
    : `Your appointment is confirmed for ${fechaFmt} at ${horaFmt} — Dental Reforma, Tijuana.`;
  const headline = isES ? "Cita Confirmada" : "Appointment Confirmed";
  const greeting = isES
    ? `Estimado/a <strong style="color:#2e2e2f;">${nombre}</strong>, gracias por agendar con nosotros.<br>Esperamos verte pronto.`
    : `Dear <strong style="color:#2e2e2f;">${nombre}</strong>, thank you for booking with us.<br>We look forward to seeing you.`;
  const lblDate = isES ? "FECHA" : "DATE";
  const lblTime = isES ? "HORA" : "TIME";
  const lblPhone = isES ? "TELÉFONO" : "PHONE";
  const lblLocation = isES ? "UBICACIÓN" : "LOCATION";
  const calendarNote = isES
    ? "Se adjunta una invitaci&oacute;n de calendario &mdash; agr&eacute;gala para no perder tu cita."
    : "A calendar invite is attached &mdash; add it so you don't miss your visit.";
  const button = isES ? "Visita dentalreforma.com" : "Visit dentalreforma.com";

  return `<!DOCTYPE html>
<html lang="${isES ? "es" : "en"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${headline} — Dental Reforma</title>
<!--[if mso]>
<style>table,td{font-family:Verdana,Arial,sans-serif !important;}</style>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f2f3ec;">
  <span style="display:none;font-size:1px;color:#f2f3ec;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f2f3ec;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;">

          <!-- header band -->
          <tr>
            <td align="center" style="background-color:#4f646f;border-radius:14px 14px 0 0;padding:32px 40px 28px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="#fdfdfa" style="background-color:#fdfdfa;border-radius:12px;padding:16px 24px;">
                    <img src="${CLINIC_LOGO_URL}" width="220" height="124" alt="Dental Reforma" style="display:block;width:220px;height:124px;border:0;margin:0 auto;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- green accent line -->
          <tr>
            <td style="height:5px;background-color:#9cc115;font-size:0;line-height:0;" height="5">&nbsp;</td>
          </tr>

          <!-- card body -->
          <tr>
            <td style="background-color:#fdfdfa;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

                <!-- confirmed badge + headline -->
                <tr>
                  <td align="center" style="padding:40px 48px 0 48px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" width="52" height="52" style="width:52px;height:52px;background-color:#9cc115;border-radius:26px;font-family:Verdana,Arial,sans-serif;font-size:26px;font-weight:bold;color:#fdfdfa;mso-line-height-rule:exactly;line-height:52px;">&#10003;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:20px 48px 0 48px;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:bold;color:#2e2e2f;mso-line-height-rule:exactly;line-height:36px;">
                    ${headline}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:12px 48px 0 48px;font-family:Verdana,Arial,sans-serif;font-size:15px;color:#545758;mso-line-height-rule:exactly;line-height:23px;">
                    ${greeting}
                  </td>
                </tr>

                <!-- details card -->
                <tr>
                  <td style="padding:32px 48px 0 48px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8fcec;border-radius:12px;">
                      <tr>
                        <td style="padding:8px 28px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td width="110" style="padding:16px 0;border-bottom:1px solid #e4edd3;font-family:Verdana,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;font-weight:bold;color:#6b8a12;" valign="middle">${lblDate}</td>
                              <td style="padding:16px 0;border-bottom:1px solid #e4edd3;font-family:Verdana,Arial,sans-serif;font-size:15px;font-weight:bold;color:#2e2e2f;" valign="middle">${fechaFmt}</td>
                            </tr>
                            <tr>
                              <td width="110" style="padding:16px 0;border-bottom:1px solid #e4edd3;font-family:Verdana,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;font-weight:bold;color:#6b8a12;" valign="middle">${lblTime}</td>
                              <td style="padding:16px 0;border-bottom:1px solid #e4edd3;font-family:Verdana,Arial,sans-serif;font-size:15px;font-weight:bold;color:#2e2e2f;" valign="middle">${horaFmt}</td>
                            </tr>
                            <tr>
                              <td width="110" style="padding:16px 0;border-bottom:1px solid #e4edd3;font-family:Verdana,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;font-weight:bold;color:#6b8a12;" valign="middle">${lblPhone}</td>
                              <td style="padding:16px 0;border-bottom:1px solid #e4edd3;font-family:Verdana,Arial,sans-serif;font-size:15px;color:#2e2e2f;" valign="middle">${telefono}</td>
                            </tr>
                            <tr>
                              <td width="110" style="padding:16px 0;font-family:Verdana,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;font-weight:bold;color:#6b8a12;" valign="middle">${lblLocation}</td>
                              <td style="padding:16px 0;font-family:Verdana,Arial,sans-serif;font-size:15px;color:#2e2e2f;mso-line-height-rule:exactly;line-height:22px;" valign="middle">${CLINIC_ADDRESS}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- calendar note -->
                <tr>
                  <td align="center" style="padding:24px 48px 0 48px;font-family:Verdana,Arial,sans-serif;font-size:13px;color:#545758;mso-line-height-rule:exactly;line-height:20px;">
                    &#128197;&nbsp; ${calendarNote}
                  </td>
                </tr>

                <!-- button -->
                <tr>
                  <td align="center" style="padding:28px 48px 44px 48px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="#9cc115" style="border-radius:28px;">
                          <a href="https://dentalreforma.com" style="display:block;padding:15px 46px;font-family:Verdana,Arial,sans-serif;font-size:15px;font-weight:bold;color:#fdfdfa;text-decoration:none;border-radius:28px;">${button}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td align="center" style="background-color:#4f646f;border-radius:0 0 14px 14px;padding:28px 40px;">
              <div style="font-family:Verdana,Arial,sans-serif;font-size:13px;color:#f2f3ec;mso-line-height-rule:exactly;line-height:21px;">
                <strong>Dental Reforma</strong> &nbsp;&middot;&nbsp; ${CLINIC_ADDRESS}
              </div>
              <div style="font-family:Verdana,Arial,sans-serif;font-size:13px;color:#f2f3ec;mso-line-height-rule:exactly;line-height:21px;padding-top:4px;">
                <a href="tel:${CLINIC_PHONE_TEL}" style="color:#f2f3ec;text-decoration:underline;">${CLINIC_PHONE_TEXT}</a> &nbsp;&middot;&nbsp; <a href="https://dentalreforma.com" style="color:#f2f3ec;text-decoration:underline;">dentalreforma.com</a>
              </div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:12px;color:#c7d3d8;padding-top:14px;">
                Sonr&iacute;e, es la mejor decisi&oacute;n &middot; Smile, it's the best choice
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function htmlES(nombre, fecha, hora, telefono) {
  return confirmationHtml("ES", nombre, fecha, hora, telefono);
}

function htmlEN(nombre, fecha, hora, telefono) {
  return confirmationHtml("EN", nombre, fecha, hora, telefono);
}

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "clinicareforma_admin",
  password: "{+kJ!(3?I[ky",
  database: "clinicareforma_contacts",
});

try {
  connection.connect((err) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err.message);
    } else {
      console.log("Conexión a la base de datos establecida");
    }
  });
} catch (err) {
  console.error("Error al conectar a la base de datos:", err.message);
}

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
            html: htmlES(nombre_paciente, fecha, hora, telefono),
            attachments: [{ filename: "cita.ics", content: ics(nombre_paciente, fecha, hora, "ES"), contentType: "text/calendar" }],
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
            html: htmlEN(nombre_paciente, fecha, hora, telefono),
            attachments: [{ filename: "appointment.ics", content: ics(nombre_paciente, fecha, hora, "EN"), contentType: "text/calendar" }],
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
