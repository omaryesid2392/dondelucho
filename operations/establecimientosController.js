const { json } = require('express');
const { db } = require('../connections');
const establecimientosController = {}
establecimientosController.buscarEstablecimiento = async (req, res) => {
    console.log('buscar Establecimiento por id: ' + req.params.id);
    const snapshot = await db.collection('product').where('codProduct', '==', req.params.id).get();
    console.log('<<<<<<<<< ' + snapshot);
    var objeto;
    var datos = snapshot.forEach((doc) => {
        objeto = doc.data();
    });
    res.json(objeto);
}
establecimientosController.buscarEstablecimientos = async function (req, res) {
    console.log('buscar todos los categorias');
    const snapshot = await db.collection('categories').get();
    var datos = [];
    snapshot.docs.map((dato) => {
        var objeto = {
            uid: dato.id,
            ref: dato.ref.path,
            data: dato.data(),
        }
        console.log(objeto);

        datos.push(objeto);
    });
    console.log(datos);
    console.log(snapshot);
    //res.json(snapshot);
    res.send(datos);
}
establecimientosController.buscarSubcategory = async function (req, res) {

    console.log('buscar todas las subcategorias');
    console.log(req.params.id);
    console.log('path ---> ' + req.headers.referencia)
    console.log('subcategory ---> ' + req.headers.subcategory)
    const snapshot = await db.doc(req.headers.referencia).collection('subcategory').where('name', '==', req.params.id).get();
    var datos = [];
    snapshot.docs.map((result) => {
        var objeto = {
            uid: result.id,
            ref: result.ref.path,
            data: result.data(),
        }
        console.log(result.data().subcategories);

        datos.push(objeto);
    });
    console.log(datos);
    res.send(datos);
}

establecimientosController.createEstablecimiento = async (req, res) => {
    console.log('Nueva establecimiento');
    var uid;
    try {
        var newEstablecimiento = {
            codigo: req.headers.codigo,
            name: req.headers.name,
            cel: req.headers.cel,
            direction: req.headers.direction,
            nit: req.headers.nit,
        };
        uid = (await (await db.collection('establecimientos').add({ establecimientos: [newEstablecimiento] })).get()).id;
        await db.collection('establecimientos').doc(uid).update({
            uid: uid
        });
        await db.collection('users').doc(req.params.id).update({
            uidEstablecimientos: uid,
            sede: req.headers.codigo,
        });
        console.log(uid);
        res.json({ "status": uid });


    } catch (error) {
        res.json({ "status": "Error" });

    }

}
establecimientosController.createSubCategory = async (req, res) => {
    console.log('Nueva Subcategoria');
    console.log(req.headers);
    console.log(req.headers.subcategories);
    var decoListSubCategory = JSON.parse(req.headers.subcategories);
    console.log(decoListSubCategory);

    var referencia;
    try {
        var newSubCategory = {
            name: req.headers.name,
            subcategories: decoListSubCategory,
        };
        console.log(newSubCategory);
        await db.doc(req.headers.referencia).collection('subcategory').add(newSubCategory);
        console.log(referencia);
        res.json({ "status": "SubEstablecimiento guarda" });

    } catch (error) {
        res.json({ "status": "Error" });

    }

}
establecimientosController.updateEstablecimiento = async (req, res) => {
    console.log('Update establecimiento');
    console.log(req.headers.data);
    var estableci = JSON.parse(req.headers.data)
    try {
        await db.collection('establecimientos').doc(req.params.id).update(
            { establecimientos: estableci.establecimientos }
        );
       console.log(estableci.establecimientos);
        res.json({ "status": "Establecimiento actualizado" });


    } catch (error) {
        res.json({ "status": "Error" });

    }
}
establecimientosController.deleteEstablecimiento = async (req, res) => {
    console.log('delete categoria');
    var existeProducto = [];
    var referencia = req.headers.referencia;
    console.log(referencia);

    try {
        const snapshot = await db.collection('product').where('refCategory', '==', referencia).get();
        snapshot.docs.map((datos) => {
            existeProducto.push(datos.data());
        });
        console.log(existeProducto);
        if (existeProducto.length != 0) {
            res.json({ "status": "No se puede eliminar ya que hay productos relacionados con ésta categoría favor elimine los productos primero y luego elimine categoria" });

        }
        else {
            await db.doc(referencia).delete();
            res.json({ "status": "Establecimiento eliminada exitosamente" });

        }


    } catch (error) {
        res.json({ "status": error });

    }

}
module.exports = establecimientosController;