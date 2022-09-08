const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const {generarJWT} = require('../helpers/generar-jwt');

const login = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({email});
        if (!usuario) {
            return res.status(400).json({
                msg: 'User / Password no son correctos - email'
            });
        }

        //verificar si el user está activo
        if (!usuario.estado){
            return res.status(400).json({
                msg: 'User / Password no son correctos - estado'
            });
        }
        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword){
            return res.status(400).json({
                msg: 'User / Password no son correctos - pass'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login OK',
            usuario,
            token
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
    

}

module.exports = {
    login
}