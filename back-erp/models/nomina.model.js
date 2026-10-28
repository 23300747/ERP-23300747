// Logica SQL para la tabla nomina
const db = require('../config/db');
 
// Modelo Nomina

function insertar(empleadoId, periodo, montoAPagar, callback) {
    db.query(
        'INSERT INTO nomina (empleado_id, periodo, monto_a_pagar) VALUES (?, ?, ?)',
        [empleadoId, periodo, montoAPagar],
        callback
    );
}

module.exports = { insertar };
