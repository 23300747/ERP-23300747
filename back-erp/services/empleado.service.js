// Logica de crear, editar, eliminar y listar empleados, registrar asistencia y generar nomina
const db = require('../config/db');
const empleadoModel = require('../models/empleado.model');
const asistenciaModel = require('../models/asistencia.model');
const nominaModel = require('../models/nomina.model');
const movimientoModel = require('../models/movimiento.model');

// lista de empleados con su ultimo salario registrado
function obtenerEmpleados(callback) {
    empleadoModel.listarConSalario((error, rows) => {
        if (error) {
            callback(error, null);
            return;
        }
        const empleados = rows.map(e => ({
            id: e.id,
            nombre: e.nombre,
            puesto: e.puesto,
            salario: e.salario ? `$${e.salario} / qna` : '$0.00 / qna',
            turno: e.horario
        }));
        callback(null, empleados);
    });
}

function agregarEmpleado(datos, callback) {
    const { nombre, puesto, horario, administrador_id } = datos;
    empleadoModel.insertar(
        { nombre, puesto, horario, administrador_id: administrador_id || null },
        (error, resultado) => {
            if (error) {
                callback(error, null);
                return;
            }
            callback(null, { id: resultado.insertId, ...datos });
        }
    );
}

function editarEmpleado(id, datos, callback) {
    const { nombre, puesto, horario } = datos;
    empleadoModel.actualizar(id, { nombre, puesto, horario }, (error) => {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, { id, ...datos });
    });
}

function eliminarEmpleado(id, callback) {
    empleadoModel.eliminar(id, (error) => {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, { mensaje: 'Empleado eliminado' });
    });
}

function registrarAsistencia(empleadoId, datos, callback) {
    asistenciaModel.insertar(empleadoId, datos, (error, resultado) => {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, { id: resultado.insertId, empleadoId, ...datos });
    });
}

// genera la nomina  y su egreso correspondiente en finanzas
function generarNomina(empleadoId, datos, callback) {
    const { periodo, monto_a_pagar } = datos;

    db.beginTransaction((error) => {
        if (error) {
            callback(error, null);
            return;
        }

        nominaModel.insertar(empleadoId, periodo, monto_a_pagar, (error, resultado) => {
            if (error) {
                return db.rollback(() => callback(error, null));
            }

            const nominaId = resultado.insertId;

            movimientoModel.insertarEgresoNomina(monto_a_pagar, nominaId, (error) => {
                if (error) {
                    return db.rollback(() => callback(error, null));
                }

                db.commit((error) => {
                    if (error) {
                        return db.rollback(() => callback(error, null));
                    }
                    callback(null, { id: nominaId, empleadoId, periodo, monto_a_pagar });
                });
            });
        });
    });
}

module.exports = {
    obtenerEmpleados,
    agregarEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    registrarAsistencia,
    generarNomina
};
