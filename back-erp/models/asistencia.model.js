// Logica SQL para la tabla asistencia
const db = require('../config/db');

// Modelo Asistencia
function insertar(empleadoId, { fecha, hora_entrada, hora_salida, estado }, callback) {
    db.query(
        'INSERT INTO asistencia (empleado_id, fecha, hora_entrada, hora_salida, estado) VALUES (?, ?, ?, ?, ?)',
        [empleadoId, fecha, hora_entrada, hora_salida, estado],
        callback
    );
}

function contarDelDia(callback) {
    db.query('SELECT COUNT(*) AS turnosHoy FROM asistencia WHERE fecha = CURDATE()', callback);
}

module.exports = { insertar, contarDelDia };
