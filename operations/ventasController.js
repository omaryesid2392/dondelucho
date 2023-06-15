const { json } = require('express');
const { db, autenticacion } = require('../connections');

const ventasController = {}


ventasController.buscarVentadia = async (req, res) => {
    console.log('<<<<< buscar Ventas >>>>>');
    var establecimiento = req.headers.establecimiento;
    if (req.params.id == '1') {
        console.log('buscar Ventas dia');
        console.log('params >>>>' + req.params.id);
        console.log('params >>>>' + req.headers.fechaselect);
        var fechaSelect = new Date(req.headers.fechaselect);
        console.log('fechaSelect>>>');
        console.log(fechaSelect);
        console.log('<<<  >>>');
        var diaInit = fechaSelect.setDate(fechaSelect.getDate());
        var diaDespues = fechaSelect.setDate(fechaSelect.getDate() + 1);
        console.log(diaInit);
        console.log(diaDespues);
        var diaInit1 = new Date(diaInit)
        var diaInit2 = new Date(diaDespues)
        console.log(diaInit1);
        console.log(diaInit2);
        console.log('<<<  >>>');
        var listVentas = [];
        var snapshot = await db.collection('ventas').where('fechaVenta', '>=', diaInit).where('fechaVenta', '<', diaDespues).where('sede', '==', establecimiento).get();
        snapshot.docs.map((venta) => {

            console.log(Date(venta.data().fechaVenta))
            //console.log(venta.data().listProductoDetalle[0].producto)
            listVentas.push(venta.data())
        })

        res.json(listVentas);
    } else if (req.params.id == '2') {
        console.log('buscar Ventas por mes');
        console.log('params >>>>' + req.params.id);
        var fecha = new Date(req.headers.fechaselect);
        console.log('fecha >>>>' + fecha);
        var diaFecha = fecha.getDate();
        console.log('diaFecha >>>>' + diaFecha);
        console.log('division >>>>' + (fecha.getDate() / diaFecha));
        var newFormateFecha = fecha.setDate((fecha.getDate() / diaFecha));
        var fechaSelect = new Date(newFormateFecha);
        console.log('fechaSelect >>>>' + fechaSelect);
        var diaInit = fechaSelect.setMonth(fechaSelect.getMonth());
        var mesDespues = fechaSelect.setMonth(fechaSelect.getMonth() + 1);
        console.log(diaInit);
        console.log(mesDespues);
        var fechaSelect1 = new Date(diaInit);
        var fechaSelect2 = new Date(mesDespues);
        console.log(fechaSelect1);
        console.log(fechaSelect2);

        var listVentas = [];
        var snapshot = await db.collection('ventas').where('fechaVenta', '>=', diaInit).where('fechaVenta', '<', mesDespues).where('sede', '==', establecimiento).get();
        snapshot.docs.map((venta) => {
            console.log(venta.data())
            //console.log(venta.data().listProductoDetalle[0].producto)
            listVentas.push(venta.data())
        })

        res.json(listVentas);

    } else if (req.params.id == '3') {
        console.log('buscar Ventas por ProductoMes');
        console.log('params >>>>' + req.params.id);
        var fecha = Date(req.headers.fechaselect);
        console.log('fecha >>>>' + fecha);
        var diaFecha = fecha.getDate();
        console.log('diaFecha >>>>' + diaFecha);
        console.log('division >>>>' + (fecha.getDate() / diaFecha));
        var newFormateFecha = fecha.setDate((fecha.getDate() / diaFecha));
        var fechaSelect = Date(newFormateFecha);
        console.log('fechaSelect >>>>' + fechaSelect);
        var diaInit = fechaSelect.setMonth(fechaSelect.getMonth());
        var mesDespues = fechaSelect.setMonth(fechaSelect.getMonth() + 1);
        console.log(diaInit);
        console.log(mesDespues);
        var fechaSelect1 = Date(diaInit);
        var fechaSelect2 = Date(mesDespues);
        console.log(fechaSelect1);
        console.log(fechaSelect2);
        var codigoProduct = req.headers.codigoproducto;

        var listVentas = [];
        var snapshot = await db.collection('ventas').where('fechaVenta', '>=', diaInit).where('fechaVenta', '<', mesDespues).where('listCodigoProductos', 'array-contains', codigoProduct).get();
        snapshot.docs.map((venta) => {
            console.log(venta.data().listProductoDetalle[0].producto)
            venta.data().listProductoDetalle.map((value) => {
                if (value.producto.codProduct == codigoProduct) {
                    var obj = {
                        idCliente: venta.data().idCliente,
                        numeroFactura: venta.data().numeroFactura,
                        fechaVenta: venta.data().fechaVenta,
                        idEmployee: venta.data().idEmployee,
                        idCliente: venta.data().idCliente,
                        listProductoDetalle: [value]
                    }
                    listVentas.push(obj)

                }

            })
        })

        res.json(listVentas);

    }
    else if (req.params.id == '4') {
        console.log('Buscar Devoluciones');
        var listVentas = [];
        var snapshot = await db.collection('devoluciones').get();
        snapshot.docs.map((venta) => {
            listVentas.push(venta.data())
        })
        res.json(listVentas);

    }

}
ventasController.filtrarVentas = async (req, res) => {
    console.log('filtrarVentas');
    var codigo = req.headers.codigo;
    var listVentas = [];
    try {
        if (req.params.id == '1') {
            console.log('filtrarVentas por identificacion');
            var snapshot = await db.collection('ventas').where('idCliente', '==', codigo).get();
            snapshot.docs.map((venta) => {
                listVentas.push(venta.data())
            })
        }
        else if (req.params.id == '2') {
            console.log('filtrarVentas por cod factura');
            var snapshot = await db.collection('ventas').where('numeroFactura', '==', codigo).get();
            snapshot.docs.map((venta) => {
                listVentas.push(venta.data())
            })
        }
        else if (req.params.id == '3') {
            console.log('filtrarVentas por cod producto');
            var snapshot = await db.collection('ventas').where('listCodigoProductos', 'array-contains', codigo).get();
            snapshot.docs.map((venta) => {
                listVentas.push(venta.data())
            })
        }
        res.json({ 'status': 'Data existente', 'data': listVentas });

    } catch (error) {
        res.json({ 'status': 'Error', 'data': error });

    }
}
ventasController.updateVenta = async (req, res) => {
    console.log('update Venta')
    const { id } = req.params;
    const venta = {
        idUsersCliente: req.body.idUsersCliente,
        idUsersEmployee: req.body.idUsersEmployee,
        products: req.body.products,
        fecha: req.body.fecha,
        total: req.body.total,
    }
    console.log(venta)
    // await coleccionVentas.findByIdAndUpdate(req.params.id, { $set: venta }, { new: true });
    res.json({ "status": "Dato de venta actualizado", venta });

}
ventasController.createVenta = async (req, res) => {
    console.log('Nueva Venta')
    console.log(req.headers)
    var decodeListProducto = JSON.parse(req.headers.listproductodetalle)
    var decodeListCodigoProducto = JSON.parse(req.headers.listcodigoproductos)
    var fechaVeta = new Date();
    console.log(decodeListProducto[0].producto['codProduct'])
    console.log(decodeListProducto[0])
    var objetoData = {
        sede: req.headers.sede,
        numeroFactura: req.headers.numerofactura,
        total: parseInt(req.headers.total),
        descuento: parseInt(req.headers.descuento),
        idCliente: req.headers.idcliente,
        idEmployee: req.headers.idemployee,
        fechaVenta: fechaVeta.setDate(fechaVeta.getDate()),
        listProductoDetalle: decodeListProducto,
        listCodigoProductos: decodeListCodigoProducto,
    }

    var validateVenta = await db.collection('ventas').where('numeroFactura', '==', req.headers.numerofactura).get();
    if (validateVenta.empty) {
        for (let index = 0; index < decodeListProducto.length; index++) {
            var nuevaCantidad;
            var documentRef;
            var product = await db.collection('product').where('codProduct', '==', decodeListProducto[index].producto['codProduct']).where('sede','==',req.headers.sede).get();
            product.docs.map((dato) => {
                nuevaCantidad = dato.data().cant - decodeListProducto[index].cant;
                documentRef = dato.ref.path;
                console.log(documentRef)

            });
            console.log(nuevaCantidad + '----' + documentRef)
            await db.doc(documentRef).update({
                cant: nuevaCantidad,
            })


        }

        console.log(objetoData)
        var uidData = (await (await db.collection('ventas').add(objetoData)).get()).id;
        await db.collection('ventas').doc(uidData).update({ uid: uidData })
    }


    res.json({ "status": "Venta Guardada" });
}
ventasController.deleteVenta = async (req, res) => {
    console.log('Elimar Venta y generar devolucion.')
    try {
        console.log(req.headers)
        var decodeListProducto = JSON.parse(req.headers.listproductodetalle)
        console.log(decodeListProducto[0].producto['codProduct'])
        console.log(decodeListProducto[0])
        var fecha = new Date();
        var fechaSegundos = fecha.setMonth(fecha.getMonth());
        var objetoData = {
            fechaDevolucion: fechaSegundos,
            sede: req.headers.sede,
            numeroFactura: req.headers.numerofactura,
            total: parseInt(req.headers.total),
            descuento: parseInt(req.headers.descuento),
            idCliente: req.headers.idcliente,
            idEmployee: req.headers.idemployee,
            fechaVenta: req.headers.fechaventa,
            listProductoDetalle: decodeListProducto,
        }
        for (let index = 0; index < decodeListProducto.length; index++) {
            var nuevaCantidad;
            var documentRef;
            var product = await db.collection('product').where('codProduct', '==', decodeListProducto[index].producto['codProduct']).where('sede','==',req.headers.sede).get();
            product.docs.map((dato) => {
                nuevaCantidad = dato.data().cant + decodeListProducto[index].cant;
                documentRef = dato.ref.path;
                console.log(documentRef)

            });
            console.log(nuevaCantidad + '----' + documentRef)
            await db.doc(documentRef).update({
                cant: nuevaCantidad,
            })


        }

        console.log(objetoData)
        await db.collection('ventas').doc(req.headers.uid).delete();
        await db.collection('devoluciones').add(objetoData);

        console.log('Aqui va <<<<<<<<<<<<<<<')

        res.json({ "status": "Devolución exitosa" });
    } catch (error) {
        console.log(error)

        res.json({ "status": 'Error en el servidor' });

    }

}
ventasController.listarDevoluciones = async (req, res) => {
    console.log('listar devoluciones ')
    var listVentas = [];
    try {
        var snapshot = await db.collection('devoluciones').get();
        snapshot.docs.map((venta) => {
            console.log(venta.data())
            listVentas.push(venta.data())
        })
        res.json({ 'status': 'Data existente', 'data': listVentas });

    } catch (error) {
        console.log(error)
        res.json({ "status": 'Error en el servidor' });

    }

}

// ventasController.addUidVentas = async (req, res) => {
//     console.log('Add  uid Ventas ')
//     try {
//         (await db.collection('ventas').get()).docs.forEach(async (values) => {
//             await db.collection('ventas').doc(values.id).update(
//                 { uid: values.id }
//             )
//         });
//         res.json({ "status": "Uid  update" });
//     } catch (error) {
//         console.log(error)

//         res.json({ "status": 'Error en el servidor' });

//     }

// }



module.exports = ventasController;