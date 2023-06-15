
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
//const path = require('path');
const app = express();

// setting
app.set('port', process.env.PORT || 7070);

//midlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//listas routers
const rutaProducto = require('./routes/productoRouters');
const rutaVentas = require('./routes/ventasRouters');
const rutaUsers = require('./routes/usersRouters');
const rutaCategory = require('./routes/categoryRouters');
const rutaEstablecimiento = require('./routes/establecimientosRouters');

app.use('/api/dondelucho/productos/', rutaProducto);
app.use('/api/dondelucho/ventas/', rutaVentas);
app.use('/api/dondelucho/users/', rutaUsers );
app.use('/api/dondelucho/category/', rutaCategory);
app.use('/api/dondelucho/establecimientos/', rutaEstablecimiento);

//static files
//app.use(express.static(path.join(__dirname, 'public')));
module.exports = app;