const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

// Permitir solicitudes de todos los orígenes
app.use(cors());
// Configuración de la conexión a la base de datos
const connection = mysql.   createConnection({
    host: 'node183010-josebuenoiot.jelastic.saveincloud.net',
    user: 'root',
    password: 'TOzBJn5F6m',
    database: 'pruebaapi',
    connectTimeout: 100000 // Aumenta el tiempo de espera a 20 segundos (20000 milisegundos)
  });

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión establecida con la base de datos');
});


// Ruta para obtener los datos desde la base de datos
app.get('/apiprueba', (req, res) => {
  connection.query('SELECT * FROM usuario', (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
}); 
// Ruta para obtener los datos desde la base de datos filtrados por ID
app.get('/apiprueba/id', (req, res) => {
    // Obtener el valor de ID de los parámetros de la consulta
    const id = req.query.id;
  
    // Verificar si se proporcionó un ID
    if (!id) {
      res.status(400).json({ error: 'Se requiere el parámetro id' });
      return;
    }
  
    // Realizar la consulta SQL con el ID proporcionado
    connection.query('SELECT * FROM usuario WHERE id = ?', [id], (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
  
      // Verificar si se encontraron resultados
      if (results.length === 0) {
        // Si no se encontraron resultados, enviar una respuesta de error
        res.status(404).json({ error: 'No se encontraron datos para el ID proporcionado' });
        return;
      }
  
      // Si se encontraron resultados, enviar los resultados como respuesta
      res.json(results[0]); // Devuelve solo el primer resultado (suponiendo que el ID es único)
    });
  });
  

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor API iniciado en el puerto ${PORT}`);
});