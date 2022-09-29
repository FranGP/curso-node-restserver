const {response} = require('express');
const { Producto, Categoria } = require('../models');

const crearProducto = async(req, res = response) => {
    const { estado, usuario, ...body} = req.body;
    const nombre = body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({nombre});

    if(productoDB){
        return res.status(400)
        .json({
             msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    const data = {
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
        ...body
    }


    const prod = new Producto(data);
    await prod.save();

    res.status(201).json(prod);
}


const obtenerProductos = async(req, res=response) => {

    const { limite=5, desde=0 } = req.query;
    const query = {estado : true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario','nombre')
            .populate('categoria','nombre')
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req, res=response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
                            .populate('usuario','nombre')
                            .populate('categoria','nombre');

    res.json({
        producto
    });
}

const actualizarProducto = async(req, res=response) => {
    const { id } = req.params;
    const {estado, usuario, categoria, ...data} = req.body;
    
    const categoriaDB = await Categoria.findOne({nombre: categoria.toUpperCase()});
    console.log(categoriaDB,'cDB');
    if(!categoriaDB){
        return res.status(400)
        .json({
             msg: `La categoria ${categoria}, no existe`
        })
    }
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;
    data.categoria = categoriaDB._id;

    const resultado = await Producto.findByIdAndUpdate(id, data, {new:true});

    res.json(resultado);
}

const borrarProducto = async(req, res=response) => {
    const { id } = req.params; 

    const resultado = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json(resultado);
}

module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}