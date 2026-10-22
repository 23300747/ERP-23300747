const express = require('express');
const router = express.Router();
const ventaService = require('../services/venta.service');
const { exigirSesion, soloPara } = require('../middleware/auth');

// Validar ítems de una orden y verificar inventario
router.post('/validar', exigirSesion, soloPara('administrador', 'cliente'), (req, res) => {
    const { items } = req.body;
    ventaService.validarStockOrden(items, (error, resultado) => {
        if (error) {
            return res.status(400).json({ mensaje: error.message });
        }
        res.json({
            valido: true,
            resumen: resultado
        });
    });
});

module.exports = router;
