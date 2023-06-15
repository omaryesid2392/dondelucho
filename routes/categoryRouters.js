const { Router} = require('express')
const router = Router();
const controller = require('../operations/categoryController');

//router.get('/productos', controller.indexLogin);
router.get('/:id', 	controller.buscarCategoria);
router.get('/', controller.buscarCategorias);
router.get('/subcategory/:id', controller.buscarSubcategory);
router.get('/subcategorys/:id', controller.buscarSubcategorys);
router.post('/createcategory', controller.createCategory);
router.post('/createsubcategory', controller.createSubCategory);
router.put('/updatecategory/:id', controller.updateCategory);
router.put('/updatesubcategory/:id', controller.updateSubcategory);
router.delete('/deletecategory/:id', controller.deleteCategory);
module.exports = router