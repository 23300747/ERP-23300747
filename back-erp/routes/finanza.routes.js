//conexiones a controladores y middleware para finanza
const express = require('express');
const router = express.Router();
const finanzaController = require('../controllers/finanza.controller');
const { exigirSesion, soloPara } = require('../middleware/auth');

router.use(exigirSesion, soloPara('administrador'));

router.get('/resumen', finanzaController.consultarResumen);
router.get('/grafica', finanzaController.consultarGrafica);
router.get('/reportes', finanzaController.consultarReportes);
router.post('/movimiento', finanzaController.registrarMovimiento);

module.exports = router;
