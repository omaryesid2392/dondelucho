const { Router} = require('express')
const router = Router();
const controller = require('../operations/usersController');

router.get('/:id', controller.buscarUser);
router.get('/proveedores/todos', controller.buscarUsersProveedores);
router.post('/', controller.loginUser);
router.post('/updateuser/:id', controller.updateUser);
router.post('/createuser', controller.createUser);
router.delete('/delete/:id', controller.deleteUser);
module.exports = router