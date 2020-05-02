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
socket.on('connect', () => {
  console.log('connected');
});

let itemInput = '';
let listId = '';
let setId = '';

if(getCookie('previous')){
  setId = getCookie('previous');
  m.request({
      url: '/getList',
      method: 'GET',
      params: { listId: setId }
  })
  .then(r => List.addArray(r));
  socket.on(`${setId}`, (items) => {
    console.log('updated list: ' + JSON.parse(items));
    List.addArray(JSON.parse(items));
  });
}
console.log('current setId: ' + setId);
let ListConnector = {
  oi: e => listId = e.target.value,
  oc: e => {
    setId = listId;
    setCookie('previous', setId);
    socket.on(`${setId}`, (items) => {
      console.log('updated list: ' + JSON.parse(items));
      List.addArray(JSON.parse(items));
    });
    console.log('listId: ' + listId);
    console.log('setId: ' + setId);
    m.request({
        url: '/getList',
        method: 'GET',
        params: { listId: setId }
    })
    .then(r => List.addArray(r));
  },
  view: () => m('div', {class: 'ListConnector'}, [
    m('input', {type: 'text', text: setId, oninput: ListConnector.oi, placeholder: setId || 'ID...'}),
    m('input', {type: 'submit', onclick: ListConnector.oc, value: 'GET'})
  ])
};

let ItemAdder = {
  view: (vnode) => m('div', {class: 'ItemAdder'}, [
    m('input', {type: 'text', oninput: vnode.attrs.oiCb, placeholder: 'Item...'}),
    m('input', {type: 'submit', onclick: vnode.attrs.ocCb, value: '+ Add'})
  ])
};

let ListItem = {
  view: (vnode) => m('div', {class: 'ListItem flex'}, [
    m('p', vnode.attrs.item),
    m('button', {onclick: vnode.attrs.ocCb}, 'X')
  ])
};

let List = {
  textEntered: '',
  items: [],
  addArray: (a) => {
    List.items = a.map( i => m(ListItem, {item: i, ocCb: List.onRemove}));
    m.redraw();
  },
  onRemove: (e) => {
    console.log(e);
    socket.emit('remove item', JSON.stringify({
      item: e.target.previousElementSibling.innerHTML,
      id: setId
    }));
  },
  onInput: (e) => List.textEntered = e.target.value,
  onAdd: (e) => {
    socket.emit('add item', JSON.stringify({item: List.textEntered, id: setId}));
    e.target.previousElementSibling.value = '';
  },
  view: () => m('div', {class: 'List'}, [
      m(ListConnector),
      m(ItemAdder, {oiCb: List.onInput, ocCb: List.onAdd}),
      m('div', {class: 'items flex a-i-center d-column'}, List.items)
  ])
}; export default List;
