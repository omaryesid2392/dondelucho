
class detalleVenta {
    detalleVenta(
        cant,
        description,
        precioUnitario,
        subtotal,
    ) {
        this.cant;
        this.description;
        this.precioUnitario;
        this.subtotal;
    }
}

module.exports = detalleVenta;

// const db = require('../connections');
// const productos = {
//     'cant': 40,
//     'codProduct': '8768767',
//     'description': '2224 4hg hb4',
//     'fechaRegistro': new Date(),
//     'name': 'Xiomi2',
//     'proveedor': 'Corbeta2',
//     'refCategory': 'categories/kScN5967fxmmV9z03YKF',
//     'vCompra': 90000,
//     'vMinVenta': 900000,
//     'vPublico': 950000
// }

// console.log('>>>>>>>> ');
// //console.log(db);
// let resul;
// async function buscar() {
//     const snapshot = await db.collection('product').add(productos);

//     // console.log('<<<<<<<<< ' + snapshot);
//     // snapshot.forEach((doc) => {
//     //     console.log(doc.data());
//     // });

// }
// buscar();



//db.push().collection('product').add(producto);


// module.exports = mongoose.model('Venta', venta);