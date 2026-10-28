//conexiones a a controladores y middleware para el paypal
const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal.controller');
const { exigirSesion, soloPara } = require('../middleware/auth');

router.post('/orden', exigirSesion, soloPara('administrador', 'cliente'), paypalController.crearOrden);
router.post('/capturar/:orderId', exigirSesion, soloPara('administrador', 'cliente'), paypalController.capturarOrden);

module.exports = router;
