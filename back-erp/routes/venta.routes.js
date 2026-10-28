const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const { exigirSesion, soloPara } = require('../middleware/auth');

router.use(exigirSesion, soloPara('administrador', 'cliente'));

router.get('/resumen', ventaController.consultarResumen);
router.get('/', ventaController.listar);
router.post('/', ventaController.crear);
router.get('/:id/factura', ventaController.consultarFactura);

module.exports = router;
