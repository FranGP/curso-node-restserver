const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async (req, res = response, next) => {
    const token = req.header('x-token');
    if (!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        //obtengo el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario || !usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existente'
            });
        }

        req.usuario = usuario;

        next();
    } catch(err){
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }

    
}

module.exports = {
    validarJWT
}