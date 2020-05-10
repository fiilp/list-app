/**
* Controlls socket events between server and client.
*
* @author   Filip Garamvölgyi
* @created  2020-05-03
*/
const {getList, setList} = require('./../integration/dbIntegration.js');
const DELETE_TIMEOUT = 1000*60*60; // 1 hour

/**
* Initiates the io socket interactions with the user.
*
* @param io  io socket component of a server.
*/
const ioInit = (io, lists) => {
  io.on('connection', (socket) => {
    socket.on('add item', (item) => {
      console.log(item);
      
      addToList(item, io, lists);
    });
    socket.on('remove item', (item) => {
      removeFromList(item, io, lists);
    });
  });
};

/**
 * Adds a single item to the list.
 * 
 * @param  item   item to add. {item, id}
 * @param  io     io socket of the web server.
 * @param  lists  contains all of the lists that currently are
 *                cached.
 */
const addToList = (item, io, lists) => {
  const o = JSON.parse(item);
  if(lists[o.id]) itemExists(o, lists);
  else {
    lists[o.id] = [];
     setTimeout(() => {io.emit(`${o.id}`, JSON.stringify([])); delete lists[o.id]}, DELETE_TIMEOUT);
   };
  lists[o.id] = [{item: o.item, color: o.color}].concat(lists[o.id]);
  setList(o.id, lists[o.id]);
  io.emit(`${o.id}`, JSON.stringify(lists[o.id]));
};

/**
 * Looks for a item in a list.
 * 
 * @param  item   item to look for in the list. {item, id} 
 * @param  lists  contains all of the lists that currently are
 *                cached.
 */
const itemExists = (item, lists) => {
  lists[item.id] = lists[item.id].filter(e => e.item != item.item);
};

/**
 * Removes a single item from a list.
 * 
 * @param  item   item to remove. {item, id}
 * @param  io     io socket of the web server.
 * @param  lists  contains all of the lists that currently are
 *                cached.
 */
const removeFromList = (item, io, lists) => {
  const o = JSON.parse(item);
  itemExists(o, lists);
  setList(o.id, lists[o.id]);
  io.emit(`${o.id}`, JSON.stringify(lists[o.id]));
};

module.exports = ioInit;
