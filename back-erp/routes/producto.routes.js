//conexiones a controladores y middleware para el producto
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { exigirSesion, soloPara } = require('../middleware/auth');

router.get('/', productoController.listar);
router.post('/', exigirSesion, soloPara('administrador'), productoController.crear);
router.put('/:id', exigirSesion, soloPara('administrador'), productoController.editar);
router.delete('/:id', exigirSesion, soloPara('administrador'), productoController.eliminar);

module.exports = router;
