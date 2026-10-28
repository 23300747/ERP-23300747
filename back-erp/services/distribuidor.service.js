// logica de crear, editar, eliminar y listar distribuidores
const distribuidorModel = require('../models/distribuidor.model');

function obtenerDistribuidores(callback) {
    distribuidorModel.listar(callback);
}

function validarNombre(nombre) {
    if (typeof nombre !== 'string' || !nombre.trim()) {
        const error = new Error('El nombre del distribuidor es obligatorio');
        error.code = 'VALIDATION';
        return error;
    }
    if (nombre.trim().length > 100) {
        const error = new Error('El nombre del distribuidor no puede superar los 100 caracteres');
        error.code = 'VALIDATION';
        return error;
    }
    return null;
}

function agregarDistribuidor(datos, callback) {
    const errorNombre = validarNombre(datos.nombre);
    if (errorNombre) {
        callback(errorNombre, null);
        return;
    }

    const nombre = datos.nombre.trim();
    distribuidorModel.insertar(nombre, (error, resultado) => {
        if (error) return callback(error, null);
        callback(null, { id: resultado.insertId, nombre });
    });
}

function editarDistribuidor(id, datos, callback) {
    const errorNombre = validarNombre(datos.nombre);
    if (errorNombre) {
        callback(errorNombre, null);
        return;
    }

    const nombre = datos.nombre.trim();
    distribuidorModel.actualizar(id, nombre, (error) => {
        if (error) return callback(error, null);
        callback(null, { id: Number(id), nombre });
    });
}

function eliminarDistribuidor(id, callback) {
    distribuidorModel.eliminar(id, (error) => {
        if (error) return callback(error, null);
        callback(null, { mensaje: 'Distribuidor eliminado' });
    });
}

module.exports = {
    obtenerDistribuidores,
    agregarDistribuidor,
    editarDistribuidor,
    eliminarDistribuidor
};
