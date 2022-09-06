const { response, request } = require('express');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if( !existeRol ){
        throw new Error('No es un rol válido');
    }
}

const emailExiste = async(email = '') => {
    const existeEmail = await Usuario.findOne({ email: email });
    if( existeEmail ){
        throw new Error('El correo ya está registrado');
    }
}

const usuarioExistePorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ){
        throw new Error('El usuario no existe');
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    usuarioExistePorId
}