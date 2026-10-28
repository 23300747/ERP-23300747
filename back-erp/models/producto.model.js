// Logica SQL para la tabla producto
const db = require('../config/db');

// Modelo Producto

function listar(callback) {
    db.query('SELECT * FROM producto', callback);
}

function buscarPorIds(ids, callback) {
    db.query('SELECT id, nombre, precio, cantidad FROM producto WHERE id IN (?)', [ids], callback);
}

function insertar({ nombre, categoria, precio, cantidad, imagen }, callback) {
    db.query(
        'INSERT INTO producto (nombre, categoria, precio, cantidad, imagen, fecha_modificacion) VALUES (?, ?, ?, ?, ?, NOW())',
        [nombre, categoria, precio, cantidad, imagen],
        callback
    );
}

function actualizar(id, { nombre, categoria, precio, cantidad, imagen }, callback) {
    db.query(
        'UPDATE producto SET nombre = ?, categoria = ?, precio = ?, cantidad = ?, imagen = COALESCE(?, imagen), fecha_modificacion = NOW() WHERE id = ?',
        [nombre, categoria, precio, cantidad, imagen, id],
        callback
    );
}

function descontarStock(id, cantidad, callback) {
    db.query(
        'UPDATE producto SET cantidad = cantidad - ?, fecha_modificacion = NOW() WHERE id = ?',
        [cantidad, id],
        callback
    );
}

function eliminar(id, callback) {
    db.query('DELETE FROM producto WHERE id = ?', [id], callback);
}

function resumenInventario(callback) {
    db.query(
        `SELECT COUNT(*) AS totalProductos, SUM(CASE WHEN cantidad < 10 THEN 1 ELSE 0 END) AS stockBajo FROM producto`,
        callback
    );
}

module.exports = {
    listar,
    buscarPorIds,
    insertar,
    actualizar,
    descontarStock,
    eliminar,
    resumenInventario
};
