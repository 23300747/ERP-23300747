//da tokens y logica detras de la autenticacion
const jwt = require('jsonwebtoken');
const { ErrorHttp } = require('../middleware/errorHttp');
const UsuarioModel = require('../models/usuario.model');

function secretoJWT() {
    const secreto = process.env.JWT_SECRET;
    if (!secreto || secreto.length < 32) {
        throw new ErrorHttp(500, 'La clave JWT no esta configurada correctamente');
    }
    return secreto;
}

function emitirToken(usuario) {
    return jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        secretoJWT(),
        { expiresIn: '8h' }
    );
}

function verificarToken(credencial) {
    return jwt.verify(credencial, secretoJWT());
}

// Busca al usuario (administrador o cliente) por correo y contrasena
function iniciarSesion(correo, contrasena, callback) {
    UsuarioModel.buscarPorCredenciales(correo, contrasena, callback);
}

function correoRegistrado(correo, callback) {
    UsuarioModel.buscarPorCorreo(correo, callback);
}

function crearCuentaCliente(datos, callback) {
    UsuarioModel.crearCliente(datos, callback);
}

module.exports = {
    emitirToken,
    verificarToken,
    iniciarSesion,
    correoRegistrado,
    crearCuentaCliente
};
