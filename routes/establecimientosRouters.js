const { Router} = require('express')
const router = Router();
const controller = require('../operations/establecimientosController');

//router.get('/productos', controller.indexLogin);
router.get('/:id', 	controller.buscarEstablecimiento);
router.get('/', controller.buscarEstablecimientos);
router.post('/createstablecimiento/:id', controller.createEstablecimiento);
router.put('/updatestablecimiento/:id', controller.updateEstablecimiento);
router.delete('/deletestablecimiento/:id', controller.deleteEstablecimiento);
module.exports = router