class Producto {
    constructor(id, nombre, descripcion, costoCompra, costoVenta, stock, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.costoCompra = costoCompra;
        this.costoVenta = costoVenta;
        this.stock = stock;
        this.imagen = imagen;
    }
}

module.exports = Producto;
