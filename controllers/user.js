const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');


const usersGet = async(req = request, res = response) => {

    const { limite=5, desde=0 } = req.query;
    const query = {estado : true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usersPut = async (req, res = response) => {
    const id = req.params.id;
    const {_id, password, google, correo, ...resto } = req.body;

    //TODO validar contra bd
    if( password ){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password,salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usersPost = async (req, res = response) => {    

    const { nombre, email, password, rol } = req.body;

    const usuario = new Usuario({nombre, email, password, rol});

    //encriptar pass
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(usuario.password,salt);

    //Guardar en BD
    await usuario.save();

    res.json({
        "msg": "Usuario creado existosamente",
        usuario
    });
}

const usersDelete = async(req, res = response) => {
    const { id } = req.params.id;

    //Borrado fisico
   // const usuario = await Usuario.findByIdAndDelete(id);

    //Borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario);
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}