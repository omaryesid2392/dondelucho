
const firebase = require('./connections');
const http = require("http");
const app = require('./app');
// const dotenv = require('dotenv');
// dotenv.config();
const server = http.createServer(app);
server.listen(app.get('port'),()=> {
	console.log(process.env.npm_package_name + " iniciado en puerto "+ app.get('port'))
});

