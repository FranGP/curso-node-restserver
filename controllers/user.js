const { response, request } = require('express');

const usersGet = (req = request, res = response) => {

    const params = req.query;

    res.json({
        "msg": "get API - Controller",
        params
    });
}

const usersPut = (req, res = response) => {
    const id = req.params.id;
    res.json({
        "msg": "put API - Controller",
        id
    });
}

const usersPost = (req, res = response) => {
    const {nombre, edad} = req.body;
    res.json({
        "msg": "post API - Controller",
        nombre,
        edad
    });
}

const usersDelete = (req, res = response) => {
    const id = req.params.id;
    res.json({
        "msg": "delete API - Controller",
        id
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}