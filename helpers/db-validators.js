const { Categoria, Role, Usuario, Producto } = require('../models');

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

const existeCategoria = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria ){
        throw new Error('La categoria no existe');
    }
}

const existeProducto = async(id) => {
    const existeProducto = await Producto.findById(id);
    if( !existeProducto ){
        throw new Error('El Producto no existe');
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    usuarioExistePorId,
    existeCategoria,
    existeProducto
}