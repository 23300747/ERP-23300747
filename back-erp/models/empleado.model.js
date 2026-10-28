// Logica SQL para la tabla empleado
const db = require('../config/db');

// Modelo Empleado
// Lista de empleados con su ultimo salario registrado
function listarConSalario(callback) {
    db.query(
        `SELECT e.id, e.nombre, e.puesto, e.horario,
                (SELECT n.monto_a_pagar FROM nomina n WHERE n.empleado_id = e.id ORDER BY n.id DESC LIMIT 1) AS salario
         FROM empleado e`,
        callback
    );
}

function insertar({ nombre, puesto, horario, administrador_id }, callback) {
    db.query(
        'INSERT INTO empleado (nombre, puesto, horario, administrador_id) VALUES (?, ?, ?, ?)',
        [nombre, puesto, horario, administrador_id],
        callback
    );
}

function actualizar(id, { nombre, puesto, horario }, callback) {
    db.query(
        'UPDATE empleado SET nombre = ?, puesto = ?, horario = ? WHERE id = ?',
        [nombre, puesto, horario, id],
        callback
    );
}

function eliminar(id, callback) {
    db.query('DELETE FROM empleado WHERE id = ?', [id], callback);
}

function contar(callback) {
    db.query('SELECT COUNT(*) AS empleados FROM empleado', callback);
}

module.exports = { listarConSalario, insertar, actualizar, eliminar, contar };
