//validaciones de empleado
const empleadoService = require('../services/empleado.service');

function listar(req, res) {
    empleadoService.obtenerEmpleados((error, empleados) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al consultar empleados' });
        }
        res.json(empleados);
    });
}

function crear(req, res) {
    empleadoService.agregarEmpleado(req.body, (error, empleado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al agregar empleado' });
        }
        res.status(201).json(empleado);
    });
}

function editar(req, res) {
    empleadoService.editarEmpleado(req.params.id, req.body, (error, empleado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al editar empleado' });
        }
        res.json(empleado);
    });
}

function eliminar(req, res) {
    empleadoService.eliminarEmpleado(req.params.id, (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al eliminar empleado' });
        }
        res.json(resultado);
    });
}

function registrarAsistencia(req, res) {
    empleadoService.registrarAsistencia(req.params.id, req.body, (error, asistencia) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al registrar asistencia' });
        }
        res.status(201).json(asistencia);
    });
}

function generarNomina(req, res) {
    empleadoService.generarNomina(req.params.id, req.body, (error, nomina) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al generar nomina' });
        }
        res.status(201).json(nomina);
    });
}

module.exports = { listar, crear, editar, eliminar, registrarAsistencia, generarNomina };
