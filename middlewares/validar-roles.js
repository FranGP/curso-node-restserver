const { response } = require('express');

const esAdminRole = (req, res = response, next) => {
    
    if (!req.usuario){
        return res.status(500).json({
            msg: 'se quiere verificar el rol sin tener validar el token primero'
        })
    }

    console.log(req.usuario);

    const {rol} = req.usuario;

    if (rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: 'El usuario no es ADMIN'
        })
    }
    next();
}

const tieneRole = (...roles) => {
    
    return (req, res=response, next) => {
        if (!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: 'El servicio requiere uno de estos roles:'+roles
            });
        }
        
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}