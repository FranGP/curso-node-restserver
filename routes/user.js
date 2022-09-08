const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, usersPut, usersPost, usersDelete } = require('../controllers/user');
const { esRolValido, emailExiste, usuarioExistePorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, tieneRole} = require('../middlewares');

const router = Router();

router.get('/', usersGet);

router.put('/:id', [
    check('id','No es un id válido').isMongoId(),
    check('id').custom(usuarioExistePorId),
    check('rol').custom( esRolValido ),
    validarCampos
    ],
    usersPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mas de 6 letras').isLength({min: 6}),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExiste ),    
    check('rol').custom( esRolValido ),
    validarCampos
    ],
    usersPost);

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','No es un id válido').isMongoId(),
    check('id').custom(usuarioExistePorId),
    validarCampos
    ], 
    usersDelete);




module.exports = router;