const { json } = require('express');
const { db } = require('../connections');
const productosController = {}
productosController.buscarProducto = async (req, res) => {
    console.log('buscar producto por id: ' + req.params.id);
    var snapshot;
    if (req.headers.sede != undefined) {
        console.log('<<<<< Entro aqui >>>>>')
        snapshot = await db.collection('product').where('codProduct', '==', req.params.id).where('sede', '==', req.headers.sede).get();

    } else {
        console.log('<<<<< Entro aqui >>>>> 11')
        snapshot = await db.collection('product').where('codProduct', '==', req.params.id).get();

    }
    console.log('<<<<<<<<< ' + snapshot);
    var datos = [];
    snapshot.forEach((doc) => {
        datos.push(doc.data());
    });
    console.log('>>>>>>>>' + datos);
    res.json(datos);

}
productosController.buscarProductoPorCategory = async (req, res) => {
    console.log('buscar producto por id: ' + req.params.id);
    const snapshot = await db.collection('product').where('refCategory', '==', req.headers.category).get();
    console.log('<<<<<<<<< ' + snapshot);
    var datos = [];
    snapshot.forEach((doc) => {
        console.log(doc.data());
        datos.push(doc.data());
    });
    console.log('>>>>>>>>' + datos);
    //console.log(Object.keys(objeto).length === 0)
    res.json(datos);

}
productosController.buscarProductos = async function (req, res) {
    console.log('buscar todos los productos.');
    const snapshot = await db.collection('product').get();
    var datos = [];
    snapshot.docs.map((dato) => {
        datos.push(dato.data());
    });
    console.log(datos);
    res.json(datos);
}

productosController.createProducto = async (req, res) => {
    console.log('Nuevo productos');
    console.log(req.headers);
    var newProducto = {
        fechaRegistro: new Date(),
        refCategory: req.headers.refcategory,
        name: req.headers.name,
        vCompra: parseInt(req.headers.vcompra),
        vPublico: parseInt(req.headers.vpublico),
        vMinVenta: parseInt(req.headers.vminventa),
        cant: parseInt(req.headers.cant),
        description: req.headers.description,
        proveedor: req.headers.proveedor,
        codProduct: req.headers.codproduct,
        refSubCategory: req.headers.refsubcategory,
        sede: req.headers.sede,

    }
    console.log(newProducto);

    try {
        var searchProduct = await db.collection('product').where('codProduct', '==', req.headers.codproduct).where('sede', '==', req.headers.sede).get();
        if (searchProduct.empty) {
            var uidData = (await (await db.collection('product').add(newProducto)).get()).id;
            await db.collection('product').doc(uidData).update({ uid: uidData })
            res.json({ "status": "Producto guardado" });
        }
        else {
            res.json({ "status": "El código del producto ya está en uso en la sede seleccionada, favor utilizar un codigo diferente o seleccionar otro local" });
        }

    } catch (error) {
        res.json({ "status": "Error" });

    }
}
productosController.updateProducto = async (req, res) => {
    console.log('update Producto')
    try {
        var documento = req.headers.uid;

        var producto = {
            fechaRegistro: new Date(),
            codProduct: req.headers.codproduct,
            vCompra: parseInt(req.headers.vcompra),
            vPublico: parseInt(req.headers.vpublico),
            vMinVenta: parseInt(req.headers.vminventa),
            cant: parseInt(req.headers.cant),
            description: req.headers.description,

        }
        console.log(producto)
        await db.collection("product").doc(documento).update(producto);
        await db.collection("gestioningresos").add(producto);
        console.log(req.params.id)
        res.json({ "status": "Producto actualizado" });
    } catch (error) {
        console.log(error)
        res.json({ "status": 'Error' });
    }


}
productosController.deleteProducto = async (req, res) => {
    console.log('delete Producto')
    var referencia = req.params.id;
    console.log(referencia);
    console.log(req.headers);
    console.log(req.headers.name);
    console.log(req.headers.referencia);

    try {
        await db.collection("product").doc(req.headers.referencia).delete();
        console.log('>>>>>>>>' + req.params.id);
        res.json({ "status": "Producto borrado con exito!" });
    } catch (error) {
        res.json({ "status": "Error, producto no borrado" });
    }



}
productosController.updateSede = async (req, res) => {
    console.log('<<<< Update sede >>>>');


    try {

        var searchProduct = await db.collection('product').where('refSubCategory', '==', 'null').get();
        console.log('Referencia >>>>> ' + searchProduct.length)
        searchProduct.docs.map(async (dato) => {
            documentRef = dato.ref.path;
            console.log('Referencia >>>>> ' + documentRef)
            await db.doc(documentRef).update({
                refSubCategory: '',
            })
        });
        res.json({ "status": "Datos actualizados" });

    } catch (error) {
        res.json({ "status": "Error" });

    }
}
module.exports = productosController;