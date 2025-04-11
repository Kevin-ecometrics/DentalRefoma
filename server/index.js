const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Cambia por tu contraseña de MySQL
  database: 'dentalreforma',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar conexión a la base de datos al iniciar
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

// Endpoint para obtener citas ocupadas
app.get('http://localhost:3001/api/citas/ocupadas', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT fecha, hora FROM citas ORDER BY fecha, hora'
    );
    
    // Configurar headers para evitar caché
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener citas ocupadas:', err);
    res.status(500).json({ 
      error: 'Error al obtener citas ocupadas',
      details: err.message
    });
  }
});

// Endpoint para agendar nuevas citas
app.post('http://localhost:3001/api/citas/agendar', async (req, res) => {
  const { nombre_paciente, correo, telefono, fecha, hora } = req.body;

  // Validación de campos requeridos
  if (!nombre_paciente || !telefono || !fecha || !hora) {
    return res.status(400).json({ 
      error: 'Faltan campos obligatorios',
      required: ['nombre_paciente', 'telefono', 'fecha', 'hora']
    });
  }

  // Validar formato de teléfono (10 dígitos)
  if (!/^\d{10}$/.test(telefono)) {
    return res.status(400).json({ 
      error: 'Formato de teléfono inválido',
      message: 'El teléfono debe tener exactamente 10 dígitos'
    });
  }

  // Validar formato de fecha (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ 
      error: 'Formato de fecha inválido',
      message: 'La fecha debe estar en formato YYYY-MM-DD'
    });
  }

  // Validar formato de hora (HH:MM:SS)
  if (!/^\d{2}:\d{2}:\d{2}$/.test(hora)) {
    return res.status(400).json({ 
      error: 'Formato de hora inválido',
      message: 'La hora debe estar en formato HH:MM:SS'
    });
  }

  try {
    // Verificar disponibilidad primero
    const [existing] = await pool.query(
      'SELECT id FROM citas WHERE fecha = ? AND hora = ?',
      [fecha, hora]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ 
        error: 'Cita no disponible',
        message: 'La fecha y hora seleccionadas ya están ocupadas'
      });
    }

    // Insertar la nueva cita
    const [result] = await pool.query(
      'INSERT INTO citas (nombre_paciente, correo, telefono, fecha, hora) VALUES (?, ?, ?, ?, ?)',
      [nombre_paciente, correo, telefono, fecha, hora]
    );
    
    // Devolver los datos de la cita creada
    const [newAppointment] = await pool.query(
      'SELECT * FROM citas WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Cita agendada exitosamente',
      data: newAppointment[0]
    });
    
  } catch (err) {
    console.error('Error al agendar cita:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ 
        error: 'Cita duplicada',
        message: 'La cita ya existe en el sistema'
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor',
        message: 'Ocurrió un error al agendar la cita',
        details: err.message
      });
    }
  }
});

// Endpoint para obtener todas las citas (para administración)
app.get('http://localhost:3001/api/citas', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM citas ORDER BY fecha DESC, hora DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener citas:', err);
    res.status(500).json({ 
      error: 'Error al obtener citas',
      details: err.message
    });
  }
});

// Endpoint para eliminar una cita (para administración)
app.delete('http://localhost:3001/api/citas/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM citas WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Cita no encontrada'
      });
    }
    
    res.json({ 
      success: true,
      message: 'Cita eliminada correctamente'
    });
  } catch (err) {
    console.error('Error al eliminar cita:', err);
    res.status(500).json({ 
      error: 'Error al eliminar cita',
      details: err.message
    });
  }
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    message: 'La ruta solicitada no existe'
  });
});

// Middleware para manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: 'Ocurrió un error inesperado'
  });
});

// Inicialización del servidor
async function startServer() {
  await testDatabaseConnection();
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer();

// Manejo de cierre limpio
process.on('SIGINT', async () => {
  console.log('\nCerrando conexiones...');
  await pool.end();
  process.exit(0);
});