// Logica de crear, editar, eliminar y listar productos
const productoModel = require('../models/producto.model');

function calcularEstado(cantidad) {
    if (cantidad <= 0) return { estado: 'Agotado', clase: 'roja' };
    if (cantidad < 10) return { estado: 'Poco stock', clase: 'naranja' };
    return { estado: 'Suficiente', clase: 'verde' };
}

function obtenerProductos(callback) {
    productoModel.listar((error, rows) => {
        if (error) return callback(error, null);

        const productos = rows.map(p => {
            const { estado, clase } = calcularEstado(p.cantidad);
            const precioNum = Number(p.precio || 0);
            return {
                id: p.id,
                nombre: p.nombre,
                categoria: p.categoria,
                cantidad: p.cantidad,
                precio: precioNum,
                imagen: p.imagen || '',
                estado,
                claseEstado: clase
            };
        });
        callback(null, productos);
    });
}

function agregarProducto(datos, callback) {
    const { nombre, categoria, precio, cantidad, imagen = '' } = datos;
    productoModel.insertar(
        { nombre, categoria, precio: Number(precio || 0), cantidad: cantidad || 0, imagen },
        (error, resultado) => {
            if (error) return callback(error, null);
            callback(null, { id: resultado.insertId, ...datos });
        }
    );
}

function editarProducto(id, datos, callback) {
    const { nombre, categoria, precio, cantidad, imagen } = datos;
    productoModel.actualizar(
        id,
        { nombre, categoria, precio: Number(precio || 0), cantidad, imagen },
        (error) => {
            if (error) return callback(error, null);
            callback(null, { id, ...datos });
        }
    );
}

function eliminarProducto(id, callback) {
    productoModel.eliminar(id, (error) => {
        if (error) return callback(error, null);
        callback(null, { mensaje: 'Producto eliminado' });
    });
}

module.exports = {
    obtenerProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto
};
