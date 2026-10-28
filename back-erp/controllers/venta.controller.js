//validaciones de venta
const ventaService = require('../services/venta.service');

function consultarResumen(req, res) {
    ventaService.obtenerResumenVentas((error, resumen) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al consultar resumen de ventas' });
        }
        res.json(resumen);
    });
}

function listar(req, res) {
    if (req.usuario.rol === 'cliente' && !req.usuario.id) {
        return res.status(403).json({ mensaje: 'La sesion no tiene un cliente asociado' });
    }

    const clienteId = req.usuario.rol === 'cliente' ? req.usuario.id : req.query.cliente_id;
    ventaService.obtenerVentas(clienteId, (error, ventas) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al consultar ventas' });
        }
        res.json(ventas);
    });
}

function crear(req, res) {
    const datosVenta = {
        ...req.body,
        nombre_cliente: String(
            req.body.nombre_cliente || req.body.nombreCliente || req.body.nombreReceptor || ''
        ).trim(),
        cliente_id: req.usuario.rol === 'cliente' ? req.usuario.id : null
    };

    ventaService.crearVenta(datosVenta, (error, venta) => {
        if (error) {
            return res.status(400).json({ mensaje: error.message || 'Error al registrar venta' });
        }
        res.status(201).json(venta);
    });
}

function consultarFactura(req, res) {
    if (req.usuario.rol === 'cliente' && !req.usuario.id) {
        return res.status(403).json({ mensaje: 'La sesion no tiene un cliente asociado' });
    }

    const clienteId = req.usuario.rol === 'cliente' ? req.usuario.id : req.query.cliente_id;
    ventaService.obtenerFacturaPorVenta(req.params.id, clienteId, (error, factura) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al consultar factura' });
        }
        if (!factura) {
            return res.status(404).json({ mensaje: 'Factura no encontrada o no pertenece al usuario' });
        }
        res.json(factura);
    });
}

module.exports = { consultarResumen, listar, crear, consultarFactura };
