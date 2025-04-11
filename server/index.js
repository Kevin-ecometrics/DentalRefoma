const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// Configuración de Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Cambia por tu contraseña
  database: 'dentalreforma',
  waitForConnections: true,
  connectionLimit: 10,
});

// Ruta para obtener citas ocupadas
app.get('/api/citas/ocupadas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT fecha, hora FROM citas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para agendar citas
app.post('/api/citas/agendar', async (req, res) => {
  const { nombre_paciente, correo, telefono, fecha, hora } = req.body;

  // Validación básica
  if (!nombre_paciente || !fecha || !hora) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO citas (nombre_paciente, correo, telefono, fecha, hora) VALUES (?, ?, ?, ?, ?)',
      [nombre_paciente, correo, telefono, fecha, hora]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'La fecha/hora ya está ocupada' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Servir archivos estáticos (Astro)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../dist'));
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
});