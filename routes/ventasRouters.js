const { Router} = require('express')
const router = Router();
const controller = require('../operations/ventasController');

router.get('/buscarventas/:id', controller.buscarVentadia);
router.get('/filtrarventas/:id', controller.filtrarVentas);
router.post('/createventa', controller.createVenta);
router.put('/updateventas/:id', controller.updateVenta);
router.get('/listar/devolucines/', controller.listarDevoluciones);
router.delete('/deleteventas/', controller.deleteVenta);
module.exports = router