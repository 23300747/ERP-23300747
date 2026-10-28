//conexiones a a controladores y middleware para el distribuidor
const express = require('express');
const router = express.Router();
const distribuidorController = require('../controllers/distribuidor.controller');
const { exigirSesion, soloPara } = require('../middleware/auth');

router.use(exigirSesion, soloPara('administrador'));

router.get('/', distribuidorController.listar);
router.post('/', distribuidorController.crear);
router.put('/:id', distribuidorController.editar);
router.delete('/:id', distribuidorController.eliminar);

module.exports = router;
