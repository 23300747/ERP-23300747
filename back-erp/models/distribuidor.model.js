//logica SQL para el distribuidor
const db = require('../config/db');

// Modelo Distribuidor
function listar(callback) {
    db.query('SELECT id, nombre FROM distribuidor ORDER BY nombre', callback);
}

function insertar(nombre, callback) {
    db.query('INSERT INTO distribuidor (nombre) VALUES (?)', [nombre], callback);
}

function actualizar(id, nombre, callback) {
    db.query('UPDATE distribuidor SET nombre = ? WHERE id = ?', [nombre, id], callback);
}

function eliminar(id, callback) {
    db.query('DELETE FROM distribuidor WHERE id = ?', [id], callback);
}

module.exports = { listar, insertar, actualizar, eliminar };
