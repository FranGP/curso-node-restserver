const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProducto, actualizarProducto, borrarProducto, obtenerProductos } = require('../controllers/productos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');

const router = Router();


//Obtener todos los Producto - publico
router.get('/', obtenerProductos);

//Obtener un Producto - publico
router.get('/:id',[
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProducto);

//crear un Producto - privado - cualquier persona con un token
router.post('/', [
        validarJWT,
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('categoria','No es un id de mongo').isMongoId(),
        check('categoria').custom(existeCategoria),
        validarCampos
    ], crearProducto);

//actualizar un Producto - privado - cualquier persona con un token
router.put('/:id',[
    validarJWT,
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto);

//borrar un Producto - privado - solo un admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto);

module.exports = router;