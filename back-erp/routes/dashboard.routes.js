//conexiones a a controladores y middleware para el dashboard
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { exigirSesion, soloPara } = require('../middleware/auth');

router.use(exigirSesion, soloPara('administrador'));

router.get('/', dashboardController.consultarResumen);

module.exports = router;
