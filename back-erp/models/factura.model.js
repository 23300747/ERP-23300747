// Logica SQL para la tabla factura
const db = require('../config/db');

// Modelo Factura
// Facturas con el correo del cliente
function listarConCliente(clienteId, callback) {
    let sql = `SELECT f.id AS folio,
                      COALESCE(c.correo, 'Público general') AS cliente,
                      COALESCE(f.orden_paypal_id, 'PayPal') AS canal,
                      f.fecha_emision,
                      f.archivo_xml,
                      'Facturada' AS estadoFactura
               FROM factura f
               LEFT JOIN cliente c ON c.id = f.cliente_id`;

    const parametros = [];
    if (clienteId !== undefined && clienteId !== null && clienteId !== '') {
        sql += ' WHERE f.cliente_id = ?';
        parametros.push(clienteId);
    }
    sql += ' ORDER BY f.fecha_emision DESC';

    db.query(sql, parametros, callback);
}

function insertar(clienteId, ordenPaypalId, archivoXml, callback) {
    db.query(
        `INSERT INTO factura (cliente_id, orden_paypal_id, fecha_emision, archivo_xml)
                         VALUES (?, ?, NOW(), ?)`,
        [clienteId, ordenPaypalId, archivoXml],
        callback
    );
}

// Busca por folio (id) o por orden de PayPal
function buscarPorFolio(folio, clienteId, callback) {
    let sql = 'SELECT * FROM factura WHERE (id = ? OR orden_paypal_id = ?)';
    const parametros = [folio, folio];

    if (clienteId !== undefined && clienteId !== null && clienteId !== '') {
        sql += ' AND cliente_id = ?';
        parametros.push(clienteId);
    }

    db.query(sql, parametros, callback);
}

module.exports = { listarConCliente, insertar, buscarPorFolio };
