/**
* Component used to add items to a list. Every list item can be removed.
*
* @author   Filip Garamvölgyi
* @created  2020-05-02
*/

import m from 'mithril';
import io from 'socket.io-client';
import './list.css';
import {setCookie, getCookie} from './../../utility/cookies';

const socket = io();

let itemInput = '';
let listId = '';
let setId = '';

const getListById = (toSet) => {
  if(toSet){
    setId = toSet;
    m.request({
        url: '/getList',
        method: 'GET',
        params: { listId: setId }
    })
    .then(r => List.addArray(r));
    socket.on(`${setId}`, (items) => {
      List.addArray(JSON.parse(items));
    });
  }
};

const removeListSubscribtion = (r) => {
  socket.off(r); // stops listening to the "news" event
};

if(getCookie('previous')) getListById(getCookie('previous'));

/**
* Used to connect to a list based on ID.
*/
let ListConnector = {
  // TODO: Have oninput and onclick as attributes for more flexiblity.
  oi: e => listId = e.target.value,
  oc: e => {
    if(setId) removeListSubscribtion(setId);
    getListById(listId);
    setCookie('previous', setId);
  },
  view: () => m('div', {class: 'ListConnector flex super-center'}, [
    m('input', {type: 'text', text: setId, oninput: ListConnector.oi, placeholder: setId || 'ID...'}),
    m('input', {type: 'submit', onclick: ListConnector.oc, value: 'GET'})
  ])
};

/**
* Component for putting the item name and then adding it to the list.
*
* @attribute  oiCb  Callback for when ever input is put into the text input.
* @attribute  ocCb  Callback for when the add button is clicked.
*/
let ItemAdder = {
  view: (vnode) => m('div', {class: 'ItemAdder flex super-center'}, [
    m('input', {type: 'text', oninput: vnode.attrs.oiCb, placeholder: 'Item...'}),
    m('input', {type: 'submit', onclick: vnode.attrs.ocCb, value: '+ Add'})
  ])
};

/**
* Component for items added to the list.
*
* @attribute  item  A string with the name of the item to be added.
* @attribute  ocCb  Callback when clicking the remove-button of the item.
*/
let ListItem = {
  view: (vnode) => m('div', {class: 'ListItem flex'}, [
    m('p', vnode.attrs.item),
    m('button', {onclick: vnode.attrs.ocCb}, 'X')
  ])
};

/**
* Renders all the components needed for the list
*/
let List = {
  textEntered: '',
  items: [],
  addArray: (a) => {
    List.items = a.map( i => m(ListItem, {item: i, ocCb: List.onRemove}));
    m.redraw();
  },
  onRemove: (e) => {
    socket.emit('remove item', JSON.stringify({
      item: e.target.previousElementSibling.innerHTML,
      id: setId
    }));
  },
  onInput: (e) => List.textEntered = e.target.value,
  onAdd: (e) => {
    if(setId){
      socket.emit('add item', JSON.stringify({item: List.textEntered, id: setId}));
      e.target.previousElementSibling.value = '';
    }
  },
  view: () => m('div', {class: 'List'}, [
      m(ListConnector),
      m(ItemAdder, {oiCb: List.onInput, ocCb: List.onAdd}),
      m('div', {class: 'items flex a-i-center d-column'}, List.items)
  ])
}; export default List;
