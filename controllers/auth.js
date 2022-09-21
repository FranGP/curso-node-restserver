const { response, json } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const {generarJWT} = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;

    try{
        const {nombre, img, email} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ email });

        if( ! usuario ){
            const data = {
                nombre,
                email,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario (data);

            await usuario.save(); 
        }

        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (err){
        res.status(400).json({
            ok: false,
            msg: 'el token no se pudo verificar'
        })
    }
    
}

module.exports = {
    login,
    googleSignIn
}