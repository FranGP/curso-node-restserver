const path = require('path');
const fs = require('fs');
const { response, json } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const {Usuario, Producto} = require('../models')



const cargarArchivos = async (req, res = response) => {

    try {
        const nombre = await subirArchivo(req.files,['txt','md'],'textos'); //el 2do param se puede poner como undefined

        res.json({
            nombre
        });
    } catch(err){
        res.status(400).json({err});
    }
    
}

const actualizarImagen = async(req, res = response) => {
    const { id, coleccion} = req.params;

    let modelo;
    switch(coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: 'No existe usuario con ese id'
                });
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: 'No existe producto con ese id'
                });
            }
            
        break;
        default:
            return res.status(500).json({msg: 'Acción no implementada'});
    }

    //Limpiar imagenes previas
    if(modelo.img){
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    //Subir nueva imagen
    const nombre = await subirArchivo(req.files,['png','jpg'],coleccion);
    modelo.img = nombre;
    await modelo.save();

    res.json({modelo});

}

const mostrarImagen = async(req, res=response) => {
    const { id, coleccion} = req.params;
    let placeholderRequired = false;

    let modelo;
    switch(coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                placeholderRequired = true;
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                placeholderRequired = true;
            }
            
        break;
        default:
            return res.status(500).json({msg: 'Acción no implementada'});
    }

    if(modelo?.img){
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }else{
        placeholderRequired = true;
    }
    
    if(placeholderRequired){
        const pathPlaceholder = path.join(__dirname,'../assets','image-not-found.png');
        if(fs.existsSync(pathPlaceholder)){
            return res.sendFile(pathPlaceholder);
        } 
    }
    
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen
}