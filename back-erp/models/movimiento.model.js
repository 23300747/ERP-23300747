// Logica SQL para la tabla movimiento_financiero
const db = require('../config/db');

// Modelo Movimiento

// Ingreso generado por una venta
function insertarIngresoVenta(monto, descripcion, referenciaPaypal, callback) {
    db.query(
        `INSERT INTO movimiento_financiero (tipo_movimiento, monto, fecha, descripcion, referencia_paypal)
                     VALUES ('ingreso', ?, NOW(), ?, ?)`,
        [monto, descripcion, referenciaPaypal],
        callback
    );
}

// Egreso generado por una nomina
function insertarEgresoNomina(monto, nominaId, callback) {
    db.query(
        "INSERT INTO movimiento_financiero (tipo_movimiento, monto, fecha, descripcion, nomina_id) VALUES ('egreso', ?, NOW(), 'Pago de nomina', ?)",
        [monto, nominaId],
        callback
    );
}

// Movimiento manual registrado por el administrador
function insertarManual({ tipo_movimiento, monto, descripcion }, callback) {
    db.query(
        `INSERT INTO movimiento_financiero (tipo_movimiento, monto, fecha, descripcion)
         VALUES (?, ?, NOW(), ?)`,
        [tipo_movimiento, monto, descripcion],
        callback
    );
}

// Ingresos y egresos del mes actual
function sumarIngresosYEgresosDelMes(callback) {
    db.query(
        `SELECT
            COALESCE(SUM(CASE WHEN tipo_movimiento = 'ingreso' THEN monto ELSE 0 END), 0) AS ingresosMes,
            COALESCE(SUM(CASE WHEN tipo_movimiento = 'egreso' THEN monto ELSE 0 END), 0) AS egresosMes
         FROM movimiento_financiero
         WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())`,
        callback
    );
}

// Solo ingresos del mes actual (tarjeta del dashboard)
function sumarIngresosDelMes(callback) {
    db.query(
        `SELECT COALESCE(SUM(CASE WHEN tipo_movimiento = 'ingreso' THEN monto ELSE 0 END), 0) AS ingresosMes
         FROM movimiento_financiero
         WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())`,
        callback
    );
}

// Neto (ingresos - egresos) agrupado por semana del mes actual
function netoPorSemana(callback) {
    db.query(
        `SELECT WEEK(fecha) - WEEK(DATE_SUB(fecha, INTERVAL DAYOFMONTH(fecha) - 1 DAY)) + 1 AS semana,
                COALESCE(SUM(CASE WHEN tipo_movimiento = 'ingreso' THEN monto ELSE -monto END), 0) AS neto
         FROM movimiento_financiero
         WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())
         GROUP BY semana
         ORDER BY semana`,
        callback
    );
}

// Los 20 movimientos mas recientes
function listarUltimos(callback) {
    db.query(
        `SELECT id, tipo_movimiento, monto, fecha, descripcion
         FROM movimiento_financiero
         ORDER BY fecha DESC
         LIMIT 20`,
        callback
    );
}

// Numero de ingresos del dia y su total (tarjeta del dashboard)
function resumenIngresosDelDia(callback) {
    db.query(
        `SELECT COUNT(*) AS ventasHoy, COALESCE(SUM(monto), 0) AS totalDia
         FROM movimiento_financiero
         WHERE tipo_movimiento = 'ingreso' AND DATE(fecha) = CURDATE()`,
        callback
    );
}

// Numero de ingresos del dia, total e IVA estimado (resumen de ventas)
function resumenIngresosDelDiaConIva(callback) {
    db.query(
        `SELECT COUNT(*) AS ventasHoy,
                COALESCE(SUM(monto), 0) AS totalDia,
                COALESCE(SUM(ROUND(monto * 0.16 / 1.16, 2)), 0) AS ivaAcumulado
         FROM movimiento_financiero
         WHERE tipo_movimiento = 'ingreso' AND DATE(fecha) = CURDATE()`,
        callback
    );
}

module.exports = {
    insertarIngresoVenta,
    insertarEgresoNomina,
    insertarManual,
    sumarIngresosYEgresosDelMes,
    sumarIngresosDelMes,
    netoPorSemana,
    listarUltimos,
    resumenIngresosDelDia,
    resumenIngresosDelDiaConIva
};
