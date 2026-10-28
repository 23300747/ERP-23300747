// validaciones de dashboard
const dashboardService = require('../services/dashboard.service');

function consultarResumen(req, res) {
    dashboardService.obtenerResumenDashboard((error, resumen) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al consultar dashboard' });
        }
        res.json(resumen);
    });
}

module.exports = { consultarResumen };
