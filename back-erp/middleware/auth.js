//crea una autentificacion de usuario y maneja errores de peticiones
const { ErrorHttp } = require('./errorHttp');
const { verificarToken } = require('../services/auth.service');

// Exige que la peticion traiga un token valido en el encabezado Authorization
function exigirSesion(req, res, next) {
    const encabezado = req.get('authorization') || '';
    const [tipo, credencial] = encabezado.split(' ');

    if (tipo !== 'Bearer' || !credencial) {
        return next(new ErrorHttp(401, 'Debes iniciar sesion para continuar'));
    }

    try {
        req.usuario = verificarToken(credencial);
        return next();
    } catch (error) {
        if (error instanceof ErrorHttp) {
            return next(error);
        }
        return next(new ErrorHttp(401, 'La sesion no es valida o ya vencio'));
    }
}

// Permite el paso solo a los roles indicados
function soloPara(...roles) {
    return (req, res, next) => {
        if (!req.usuario || !roles.includes(req.usuario.rol)) {
            return next(new ErrorHttp(403, 'No tienes permisos para esta operacion'));
        }
        return next();
    };
}

// Manejador global de errores
function manejarErrores(error, req, res, next) {
    if (error instanceof ErrorHttp || error.status) {
        return res.status(error.status).json({ mensaje: error.message });
    }

    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ mensaje: 'Ese dato ya esta registrado' });
    }

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ mensaje: 'No se puede eliminar: tiene registros asociados' });
    }

    console.error('Error no controlado:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
}

module.exports = { ErrorHttp, exigirSesion, soloPara, manejarErrores };
