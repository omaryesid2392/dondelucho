const { Router} = require('express')
const router = Router();
const controller = require('../operations/productosController');

//router.get('/productos', controller.indexLogin);
router.get('/:id', 	controller.buscarProducto);
router.get('/', controller.buscarProductos);
router.get('/filtrarproducto/:id', controller.buscarProductoPorCategory);
router.get('/update/sede/', controller.updateSede);
router.post('/createproducto/new', controller.createProducto);
router.put('/updateproducto/:id', controller.updateProducto);
router.delete('/deleteproducto/:id', controller.deleteProducto);
module.exports = router