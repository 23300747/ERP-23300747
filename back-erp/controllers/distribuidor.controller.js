//validación de distribuidor
const distribuidorService = require('../services/distribuidor.service');

function listar(req, res) {
    distribuidorService.obtenerDistribuidores((error, distribuidores) => {
        if (error) return res.status(500).json({ mensaje: 'Error al consultar distribuidores' });
        res.json(distribuidores);
    });
}

function crear(req, res) {
    distribuidorService.agregarDistribuidor(req.body, (error, distribuidor) => {
        if (error) {
            const status = error.code === 'VALIDATION' ? 400 : 500;
            return res.status(status).json({ mensaje: error.message || 'Error al agregar distribuidor' });
        }
        res.status(201).json(distribuidor);
    });
}

function editar(req, res) {
    distribuidorService.editarDistribuidor(req.params.id, req.body, (error, distribuidor) => {
        if (error) {
            const status = error.code === 'VALIDATION' ? 400 : 500;
            return res.status(status).json({ mensaje: error.message || 'Error al editar distribuidor' });
        }
        res.json(distribuidor);
    });
}

function eliminar(req, res) {
    distribuidorService.eliminarDistribuidor(req.params.id, (error, resultado) => {
        if (error) return res.status(500).json({ mensaje: 'Error al eliminar distribuidor' });
        res.json(resultado);
    });
}

module.exports = { listar, crear, editar, eliminar };
