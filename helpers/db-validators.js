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

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La colección ${ coleccion } no es permitida, ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    usuarioExistePorId,
    existeCategoria,
    existeProducto, 
    coleccionesPermitidas
}