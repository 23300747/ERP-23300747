// Logica de mostrar dashboard: resumen de ingresos, egresos, productos, empleados, turnos, etc.
const movimientoModel = require('../models/movimiento.model');
const productoModel = require('../models/producto.model');
const empleadoModel = require('../models/empleado.model');
const asistenciaModel = require('../models/asistencia.model');

// junta los numeros que se muestran en las tarjetas del dashboard.
function obtenerResumenDashboard(callback) {
    const resultado = {};
    let pendientes = 4;
    let huboError = false;

    function terminarUno(error) {
        if (huboError) return;
        if (error) {
            huboError = true;
            callback(error, null);
            return;
        }
        pendientes -= 1;
        if (pendientes === 0) {
            callback(null, {
                finanzas: { ingresosMes: `$${Number(resultado.finanzas.ingresosMes).toFixed(2)}`, reportes: '---' },
                inventario: { productos: resultado.inventario.totalProductos, stockBajo: resultado.inventario.stockBajo || 0 },
                ventas: { ventasHoy: resultado.ventas.ventasHoy, totalDia: `$${Number(resultado.ventas.totalDia).toFixed(2)}` },
                rh: { empleados: resultado.rh.empleados, turnosHoy: resultado.rh.turnosHoy }
            });
        }
    }

    movimientoModel.sumarIngresosDelMes((error, rows) => {
        if (error) return terminarUno(error);
        resultado.finanzas = rows[0];
        terminarUno(null);
    });

    productoModel.resumenInventario((error, rows) => {
        if (error) return terminarUno(error);
        resultado.inventario = rows[0];
        terminarUno(null);
    });

    movimientoModel.resumenIngresosDelDia((error, rows) => {
        if (error) return terminarUno(error);
        resultado.ventas = rows[0];
        terminarUno(null);
    });

    // RH: total de empleados y turnos (asistencias) registrados hoy
    empleadoModel.contar((error, filasEmpleados) => {
        if (error) return terminarUno(error);

        asistenciaModel.contarDelDia((errorAsistencia, filasAsistencia) => {
            if (errorAsistencia) return terminarUno(errorAsistencia);
            resultado.rh = {
                empleados: filasEmpleados[0].empleados,
                turnosHoy: filasAsistencia[0].turnosHoy
            };
            terminarUno(null);
        });
    });
}

module.exports = { obtenerResumenDashboard };
