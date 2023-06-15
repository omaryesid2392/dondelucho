const { json } = require('express');
const { DocumentReference } = require('firebase-admin/lib/firestore');
const { db } = require('../connections');
const categoryController = {}
categoryController.buscarCategoria = async (req, res) => {
    console.log('buscar categoria por id: ' + req.params.id);
    const snapshot = await db.collection('product').where('codProduct', '==', req.params.id).get();
    console.log('<<<<<<<<< ' + snapshot);
    var objeto;
    var datos = snapshot.forEach((doc) => {
        objeto = doc.data();
    });
    res.json(objeto);
}
categoryController.buscarCategorias = async function (req, res) {
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
categoryController.buscarSubcategory = async function (req, res) {

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
categoryController.buscarSubcategorys = async function (req, res) {

    console.log('buscar todas las subcategorias');
    console.log(req.params.id);
    console.log('path ---> ' + req.headers.referencia)
    console.log('subcategory ---> ' + req.headers.subcategory)
    const snapshot = await db.doc(req.headers.referencia).collection('subcategory').get();
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

categoryController.createCategory = async (req, res) => {
    console.log('Nueva categoria');
    // console.log(req.headers);
    // console.log(req.headers.categories);
    var decoListCategory = JSON.parse(req.headers.categories);
    var referencia;
    try {
        var newCategory = {
            name: req.headers.name,
            categories: decoListCategory,
        };
        console.log(referencia);
        referencia = (await (await db.collection('categories').add(newCategory)).get()).ref.path;
        console.log(referencia);
        res.json({ "status": referencia });


    } catch (error) {
        res.json({ "status": "Error" });

    }

}
categoryController.createSubCategory = async (req, res) => {
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
        res.json({ "status": "Subcategoria guarda" });

    } catch (error) {
        res.json({ "status": "Error" });

    }

}
categoryController.updateCategory = async (req, res) => {
    console.log('Update Categorias y Subcategories');

    var decoListCategory = JSON.parse(req.headers.categories);
    var decoListSubcategory = JSON.parse(req.headers.subcategories);
    var referencia = req.headers.referencia;
    console.log(decoListSubcategory.length)

    try {
        var newCategory = {
            name: req.headers.name,
            categories: decoListCategory,
        };
        console.log(referencia);
        await db.doc(referencia).set(newCategory);
        console.log(referencia);
        // const deleSubcategory = await db.doc(referencia).collection('subcategory').get();
        // var dataSubcategories = [];
        // var uidSubcategoriesid = [];
        // deleSubcategory.docs.forEach(async (datos) => {
        //     console.log(datos.data())
        //     dataSubcategories.push(datos.data())
        //     uidSubcategoriesid.push(datos.id)

        // });
        console.log('>>>>> despues de la consulta <<<<<');

        // if (uidSubcategories.length > 1) {
        for (let index = 0; index < decoListCategory.length; index++) {
            let existe = false;
            console.log(decoListCategory[index]);
            console.log("length decoListSubcategory >>>>> " + decoListSubcategory.length)
            for (let i = 0; i < decoListSubcategory.length; i++) {
                console.log(decoListSubcategory[i]);

                if (decoListCategory[index] == decoListSubcategory[i].name) {
                    existe = true;
                    console.log('>>>>> antes de actualizar <<<<< ' + i);
                    console.log(decoListSubcategory[i].name);
                    console.log(decoListSubcategory[i].ref);
                    if (decoListSubcategory[i].ref != null) {
                        await db.doc(decoListSubcategory[i].ref).set(decoListSubcategory[i]);
                        console.log('>>>>> con referencia <<<<<' + i);
                    }
                   else {
                    //await db.doc(referencia).collection('subcategory').add(decoListSubcategory[i]);
                    await db.doc(referencia).collection('subcategory').add(decoListSubcategory[i]);
                        console.log('>>>>> sin referencia  <<<<<' + i);
                    }


                    // for (let item = 0; item < decoListSubcategory.length; item++) {
                    //     if (decoListCategory[index] == decoListSubcategory[item].name) {
                    //         console.log(decoListSubcategory[item].name)
                    //     }
                    // }
                }
            }
            if (!existe) {
                for (let item = 0; item < decoListSubcategory.length; item++) {
                    if (decoListCategory[index] == decoListSubcategory[item].name) {
                        console.log('>>>>> antes de guardar subcategoria <<<<<');
                        await db.doc(referencia).collection('subcategory').add(decoListSubcategory[item]);
                        console.log('>>>>> despues de guardar subcategoria <<<<<');

                    }
                }
            }

            //await db.doc(referencia).collection('subcategory').doc(uidSubcategories[index]).delete();
        }

        // else{
        //     for (let i = 0; i < decoListSubcategory.length; i++) {
        //         await db.doc(referencia).collection('subcategory').add(decoListSubcategory[i]);
        //     }
        // }


        console.log(referencia);
        res.json({ "status": referencia });


    } catch (error) {
        console.log(error);
        res.json({ "status": "Error" });

    }
}
categoryController.updateSubcategory = async (req, res) => {
    console.log('update subcategoria')
    res.json({ "status": "Dato de categoria actualizado" });
}
categoryController.deleteCategory = async (req, res) => {
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
            res.json({ "status": "Categoria eliminada exitosamente" });

        }


    } catch (error) {
        res.json({ "status": error });

    }

}
module.exports = categoryController;