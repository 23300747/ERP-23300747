//conexiones a a controladores y middleware para el empleado
const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleado.controller');
const { exigirSesion, soloPara } = require('../middleware/auth');

router.use(exigirSesion, soloPara('administrador'));

router.get('/', empleadoController.listar);
router.post('/', empleadoController.crear);
router.put('/:id', empleadoController.editar);
router.delete('/:id', empleadoController.eliminar);
router.post('/:id/asistencia', empleadoController.registrarAsistencia);
router.post('/:id/nomina', empleadoController.generarNomina);

module.exports = router;
