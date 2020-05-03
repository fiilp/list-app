/**
* Used to host node server.
*
* @author   Filip Garamvölgyi
* @created  2020-05-03
*/

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const ioInit = require('./../controller/socketController.js');
const apiInit = require('./../controller/apiController.js');

let lists = {};
class Server {
    constructor() {
        this.init();
    }
    init(){
        app.use(express.static('public'));
        ioInit(io, lists);
        apiInit(app, lists);
        server.listen(process.env.PORT || 6001, () => {
            console.log('starting server...');
        })
    }
}
new Server();
