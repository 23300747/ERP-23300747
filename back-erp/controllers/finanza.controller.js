//validaciones de finanza
const finanzaService = require('../services/finanza.service');

function consultarResumen(req, res) {
    finanzaService.obtenerResumen((error, resumen) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al consultar resumen financiero' });
        }
        res.json(resumen);
    });
}

function consultarGrafica(req, res) {
    finanzaService.obtenerGraficaSemanal((error, grafica) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al consultar grafica' });
        }
        res.json(grafica);
    });
}

function consultarReportes(req, res) {
    finanzaService.obtenerReportes((error, reportes) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al consultar reportes' });
        }
        res.json(reportes);
    });
}

function registrarMovimiento(req, res) {
    finanzaService.registrarMovimiento(req.body, (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al registrar movimiento' });
        }
        res.status(201).json(resultado);
    });
}

module.exports = { consultarResumen, consultarGrafica, consultarReportes, registrarMovimiento };
