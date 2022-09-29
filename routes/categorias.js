const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategoria, actualizarCategoria, borrarCategoria, obtenerCategorias } = require('../controllers/categorias');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeCategoria } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');

const router = Router();


//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoria - publico
router.get('/:id',[
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);

//crear una categoria - privado - cualquier persona con un token
router.post('/', [
        validarJWT,
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], crearCategoria);

//actualizar una categoria - privado - cualquier persona con un token
router.put('/:id',[
    validarJWT,
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

//borrar una categoria - privado - solo un admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);

module.exports = router;