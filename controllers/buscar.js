const { response } = require('express');
const { Usuario, Categoria, Producto } = require('../models');
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
    'categorias',
    'usuarios',
    'productos',
    'roles'
]

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    let producto;
    if (esMongoID) {
        producto = await Producto.findById(termino).populate('categoria','nombre');
    } else {
        const regex = new RegExp(termino, 'i');
        producto = await Producto.find({
            $or: [{ nombre: regex }, { descripcion: regex }],
            $and: [{estado:true}]
        }).populate('categoria','nombre');
    }
    res.json({
        results: (producto) ? [producto] : []
    });
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    let categoria;
    if (esMongoID) {
        categoria = await Categoria.findById(termino);
    } else {
        const regex = new RegExp(termino, 'i');
        categoria = await Categoria.find({ nombre: regex, estado:true});
    }
    res.json({
        results: (categoria) ? [categoria] : []
    });
}

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    let usuario;
    if (esMongoID) {
        usuario = await Usuario.findById(termino);
    } else {
        const regex = new RegExp(termino, 'i');
        usuario = await Usuario.find({
            $or: [{ nombre: regex }, { email: regex }],
            $and: [{estado:true}]
        });
    }
    res.json({
        results: (usuario) ? [usuario] : []
    });
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: `Colección no válida`
            });
    }


}




module.exports = {
    buscar
}