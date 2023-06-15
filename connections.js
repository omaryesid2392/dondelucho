
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/lib/firestore');
const { getAuth } = require('firebase-admin/lib/auth');

const serviceAccount = require("./pague-menos-donde-lucho-firebase-adminsdk-n34dc-6deda1967a.json");

const app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount)});
//const db = app.firestore();
// const app = firebaseInit2.firestore();
let db = admin.firestore();
let autenticacion = admin.auth();
console.log('Firebase configurado');
module.exports = {db, autenticacion};