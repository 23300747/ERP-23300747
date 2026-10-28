//logica de finanzas, 
const movimientoModel = require('../models/movimiento.model');

// resumen de ingresos, egresos y utilidad del mes actual
function obtenerResumen(callback) {
    movimientoModel.sumarIngresosYEgresosDelMes((error, rows) => {
        if (error) {
            callback(error, null);
            return;
        }
        const ingresosMes = Number(rows[0].ingresosMes);
        const egresosMes = Number(rows[0].egresosMes);
        callback(null, {
            ingresosMes: `$${ingresosMes.toFixed(2)}`,
            egresosMes: `$${egresosMes.toFixed(2)}`,
            utilidadNeta: `$${(ingresosMes - egresosMes).toFixed(2)}`
        });
    });
}

// ingresos y egresos agrupados por semana
function obtenerGraficaSemanal(callback) {
    movimientoModel.netoPorSemana((error, rows) => {
        if (error) {
            callback(error, null);
            return;
        }
        const maximo = Math.max(1, ...rows.map(r => Math.abs(r.neto)));
        const grafica = rows.map(r => ({
            semana: `Sem ${r.semana}`,
            porcentajeAltura: Math.round((Math.abs(r.neto) / maximo) * 100)
        }));
        callback(null, grafica);
    });
}

// movimientos financieros del mes
function obtenerReportes(callback) {
    movimientoModel.listarUltimos((error, rows) => {
        if (error) {
            callback(error, null);
            return;
        }
        const reportes = rows.map(r => ({
            id: r.id,
            nombre: r.descripcion || r.tipo_movimiento,
            periodo: new Date(r.fecha).toLocaleDateString(),
            fecha: new Date(r.fecha).toLocaleDateString(),
            formato: 'CSV'
        }));
        callback(null, reportes);
    });
}

// Registra un movimiento financiero manual.
function registrarMovimiento(movimiento, callback) {
    const { tipo_movimiento, monto, descripcion } = movimiento;
    movimientoModel.insertarManual({ tipo_movimiento, monto, descripcion }, callback);
}

module.exports = {
    obtenerResumen,
    obtenerGraficaSemanal,
    obtenerReportes,
    registrarMovimiento
};
