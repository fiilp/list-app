const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

let lists = {};
const DELETE_TIMEOUT = 1000*60*60*24*7; // 1 week
class Server {
    constructor() {
        this.init = this.init.bind(this);
        this.addToList = this.addToList.bind(this);
        this.itemExists = this.itemExists.bind(this);
        this.removeFromList = this.removeFromList.bind(this);
        this.init();
    }
    init(){
        app.use(express.static('public'));
        app.get('/getList', (req, res) => {
          console.log('body from api: ' + req.query.listId);
          if(lists[req.query.listId]) res.json(lists[req.query.listId]);
          else res.json([]);
        });
        io.on('connection', (socket) => {
          socket.on('add item', (item) => {
            console.log('item added: ' + item);
            this.addToList(item);
          });
          socket.on('remove item', (item) => {
            console.log('item remove: ' + item);
            this.removeFromList(item);
          });
        });
        server.listen(6001, () => {
            console.log('starting server...');
        })
    }
    addToList(item){
      const o = JSON.parse(item);
      if(lists[o.id]) this.itemExists(o);
      else {
        lists[o.id] = [];
         setTimeout(() => {io.emit(`${o.id}`, JSON.stringify([])); delete lists[o.id]}, DELETE_TIMEOUT);
       };
      lists[o.id] = [o.item].concat(lists[o.id]);
      console.log('list to send: ' + lists[o.id]);
      io.emit(`${o.id}`, JSON.stringify(lists[o.id]));
    }
    itemExists(item){
      lists[item.id] = lists[item.id].filter(e => e != item.item);
      console.log('after itemExists: ' + lists[item.id]);
    }
    removeFromList(item){
      const o = JSON.parse(item);
      this.itemExists(o);
      console.log('list to send: ' + lists[o.id]);
      io.emit(`${o.id}`, JSON.stringify(lists[o.id]));
    }
}
new Server();
