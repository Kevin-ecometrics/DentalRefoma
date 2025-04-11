const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión MySQL clásica
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Cambia si tu MySQL tiene contraseña
  database: "dental",
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    process.exit(1);
  } else {
    console.log("Conexión a la base de datos establecida");
  }
});

// Obtener citas ocupadas
app.get("/api/citas/ocupadas", (req, res) => {
  connection.query(
    "SELECT fecha, hora FROM citas ORDER BY fecha, hora",
    (err, results) => {
      if (err) {
        console.error("Error al obtener citas:", err);
        return res.status(500).json({ error: "Error al obtener citas" });
      }
      res.json(results);
    }
  );
});

// Agendar nueva cita
app.post("/api/citas/agendar", (req, res) => {
  const { nombre_paciente, correo, telefono, fecha, hora } = req.body;

  if (!nombre_paciente || !telefono || !fecha || !hora) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // Validar cita ocupada
  connection.query(
    "SELECT id FROM citas WHERE fecha = ? AND hora = ?",
    [fecha, hora],
    (err, results) => {
      if (err) {
        console.error("Error al verificar cita:", err);
        return res
          .status(500)
          .json({ error: "Error al verificar disponibilidad" });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "Cita no disponible" });
      }

      // Insertar cita
      connection.query(
        "INSERT INTO citas (nombre_paciente, correo, telefono, fecha, hora) VALUES (?, ?, ?, ?, ?)",
        [nombre_paciente, correo, telefono, fecha, hora],
        (err, result) => {
          if (err) {
            console.error("Error al insertar cita:", err);
            return res.status(500).json({ error: "Error al agendar cita" });
          }

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

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
