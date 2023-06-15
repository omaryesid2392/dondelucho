//const coleccionUsers = require('../schemas/users.schemas');
const { json } = require('express');
const { db, autenticacion } = require('../connections');
const usersController = {}

usersController.buscarUser = async (req, res) => {
    console.log('buscar usuario por id: ' + req.params.id);
    const snapshot = await db.collection('users').where('id', '==', req.params.id).get();
    console.log('<<<<<<<<< ' + snapshot);
    var objeto;
    snapshot.forEach((doc) => {
        objeto = doc.data();
    });
    console.log('>>>>>>>>>>> ' + objeto);
    res.json(objeto);

}
usersController.loginUser = async (req, res) => {
    console.log('login');
    var email = req.headers.email;
    var password = req.headers.password;
    console.log('email ---> ' + req.headers.email)
    console.log('password ---> ' + req.headers.password)
    console.log(':::::::::::::::::::::::::::::')
    var datos = [];
    try {
        const snapshot = await db.collection('users').where('email', '==', email).where('password', '==', password).get();

        snapshot.docs.map((dato) => {
            datos.push(dato.data());
        });
        console.log(':::::::::::::: rol :::::::::::::::')
        console.log(datos[0].rol)


        if (datos[0].rol != 'PROVEEDOR' && datos[0].rol != 'CLIENT') {
            const esta = await db.collection('establecimientos').where('uid', '==', datos[0].uidEstablecimiento).get();
            console.log('<<<<<<<<<>>>>>>>>' + datos[0].uidEstablecimiento);
            console.log('<<<<<<<<< constante >>>>>>>>' + esta);
            esta.docs.map((result) => {
                console.log('>>>>>>>>' + result.data().uid)
                datos.push(result.data());
            });
        }
        console.log(datos);
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json(datos);
    }

}
usersController.buscarUsersProveedores = async (req, res) => {
    console.log('buscar todos users PROVEEDORES');
    const snapshot = await db.collection('users').where('rol', '==', 'PROVEEDOR').get();
    var datos = [];
    snapshot.docs.map((dato) => {
        datos.push(dato.data());
    });
    console.log(datos);
    res.json(datos);
}
usersController.updateUser = async (req, res) => {

    console.log(' >>>>>  Update User <<<<<<')
    console.log('email ---> ' + req.headers.email)
    console.log('password ---> ' + req.headers.password)
    console.log('rol ---> ' + req.headers.rol)
    const uid = req.params.id
    var user;
    var referencia = db.collection('users').doc(uid).path;
    console.log('referencia ---> ' + referencia)

    try {

        if (req.headers.rol != 'PROVEEDOR' && req.headers.rol != 'CLIENT') {
            // user = {
            //     id: req.headers.id,
            //     email: req.headers.email,
            //     password: req.headers.password,
            //     rol: req.headers.rol,
            //     cel: req.headers.cel,
            //     name: req.headers.name,
            //     direction: req.headers.direction,
            //     uidEstablecimiento: req.headers.uidestablecimiento,
            //     sede: req.headers.sede
            // };
            await db.doc(referencia).update({
                id: req.headers.id,
                email: req.headers.email,
                password: req.headers.password,
                rol: req.headers.rol,
                cel: req.headers.cel,
                name: req.headers.name,
                direction: req.headers.direction,
                uidEstablecimiento: req.headers.uidestablecimiento,
                sede: req.headers.sede
            });
            console.log('User Obj------>  ' + user);

        } else {
            // user = {
            //     id: req.headers.id,
            //     email: req.headers.email,
            //     password: req.headers.password,
            //     rol: req.headers.rol,
            //     cel: req.headers.cel,
            //     name: req.headers.name,
            //     direction: req.headers.direction,
            // };
            await db.doc(referencia).update({
                id: req.headers.id,
                email: req.headers.email,
                password: req.headers.password,
                rol: req.headers.rol,
                cel: req.headers.cel,
                name: req.headers.name,
                direction: req.headers.direction,
            });
            console.log('User Obj------>  ' + user);
        }
        // console.log('User Obj------>  ' + user);
        res.json({ "status": "Usuario actualizado exitosamente" });
    } catch (error) {
        res.json({ "status": "Error" });
    }

}
usersController.createUser = async (req, res) => {
    console.log('>>>> Create User <<<<')
    console.log('email ---> ' + req.headers.email)
    console.log('password ---> ' + req.headers.password)
    console.log('rol ---> ' + req.headers.rol)
    try {
        if (req.headers.rol != 'CLIENT' && req.headers.rol != 'PROVEEDOR') {
            const userSave = await autenticacion.createUser({ email: req.headers.email, password: req.headers.password });
            console.log('---->  ' + userSave['uid']);
           
            var user = {
                id: req.headers.id,
                email: req.headers.email,
                password: req.headers.password,
                rol: req.headers.rol,
                cel: req.headers.cel,
                lastSign: new Date(),
                name: req.headers.name,
                direction: req.headers.direction,
                uidEstablecimiento: req.headers.uidestablecimiento,
                sede: req.headers.sede
            };
           const uid =(await (await db.collection('users').add(user)).get()).id;
           await db.collection('users').doc(uid).update({
               uid : uid
           })
            console.log('User Obj------>  ' + user);

        }
        else {
            var user = {
                id: req.headers.id,
               // email: req.headers.email,
                rol: req.headers.rol,
                cel: req.headers.cel,
                lastSign: new Date(),
                name: req.headers.name,
               // direction: req.headers.direction,
            };
            console.log(user);
            const uid = (await (await db.collection('users').add(user)).get()).id;
            await db.collection('users').doc(uid).update({
                uid: uid,
            })

            console.log(uid);
        }
        res.json({ "status": "Usuario guardado" });
    } catch (error) {
        res.json({ "status": "Error" });
    }


}
usersController.deleteUser = async (req, res) => {
    console.log('>>> User Delete <<<<<')
    try {
        await db.collection('users').doc(req.headers.uiddelete).delete();
        await db.collection('usersDelete').add({
            fechaDelete : new Date(),
            nameUser: req.headers.nameuser,
            uidUser: req.headers.uiduser,
            idUserDelete: req.headers.iduserdelete,
            uidDelete: req.headers.uiddelete,
            nameUserDelte: req.headers.nameuserdelte,
        });


        res.json({ "status": "Usuario eliminado con exito" });
    } catch (error) {
        res.json({ "status": "Error al eliminar al usuario" });
    }


}
module.exports = usersController;