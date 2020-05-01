const express = require('express');
const app = express();

class Server {
    constructor() {
        this.init();
    }
    init(){
        app.use(express.static('public'));
    }
}
new Server();
