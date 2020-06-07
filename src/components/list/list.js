/**
* Component used to add items to a list. Every list item can be removed.
*
* @author   Filip Garamvölgyi
* @created  2020-05-02
*/

import m from 'mithril';
import io from 'socket.io-client';
import './list.css';
import ListItem from './listItem';
import ItemAdder from './itemAdder';
import ListConntectorM from '../modelAdjusted/listConnectorM';
import {setCookie, getCookie} from './../../utility/cookies';
import listModel from '../../model/listModel';
import Sort from '../sort/sort';

const socket = io();
const TEXT_ICON = 'https://img.icons8.com/material/35/000000/text-height--v1.png';
const DATE_ICON = 'https://img.icons8.com/ios/35/000000/date-to.png';
const COLOR_ICON = 'https://img.icons8.com/metro/35/000000/fill-color.png'
listModel['itemColor'] = getCookie('itemColor') || '#ffffff';
listModel['textColor'] = getCookie('textColor') || '#000000';
listModel['createSort']('created');

/**
* Renders all the components needed for the list
*/
let List = {
  inList: false,
  textEntered: '',
  items: [],
  content: () => {
    if(m.route.get().includes('/list'))
      return [
        m('h2', listModel['listTitle']),
        m(ItemAdder, {oiCb: List.onInput, ocCb: List.onAdd}),
        m('div.Sorts.flex.super-center', [
          m(Sort, {
            sort: (r) =>{listModel['createSort']('created', r); List.addArray(listModel['items']);},
            icon: DATE_ICON
          }),
          m(Sort, {
            sort: (r) => {listModel['createSort']('color', r); List.addArray(listModel['items']);},
            icon: COLOR_ICON
          }),
          m(Sort, {
            sort: (r) => {listModel['createSort']('item', r); List.addArray(listModel['items']);},
            icon: TEXT_ICON
          }),
        ]),
        m('div', {class: 'items flex a-i-center d-column'}, List.items)
      ]; 
    else {
      let content = [m(ListConntectorM)];
      if(getCookie('previous'))
      content = content.concat(
          m(m.route.Link, {href: `/list/${getCookie('previous')}`}, 'Recent list'));
      return content.concat(
       [ m('p', {class: 'desc'}, 'Every new list creates a unique link. Share the link to collaborate with others on your list.'),
        m('h2', 'How to:'), m('p', {class: 'desc'}, 
        "If you don't have a link to an existing list, create a new one! Once created, add the items you want. To change color press the menu button in the top right corner. The text and background can be adjusted. If the item has already been added just hold down your mouse or finger on the item."),
      ]
      ); 
    };  
  },
  addArray: (a) => {
    usedColors(a);
    List.items = listModel['sort'](a).map( i => m(
      ListItem, 
      {
        item: i.item, 
        textColor: i.textColor, 
        color: i.color,
        ocCb: List.onRemove,
        cCol: changeColor
      }
    ));
    m.redraw();   
  },
  onRemove: (e) => {
    removeItem(e.target.previousElementSibling.innerHTML);
  },
  onInput: (e) => List.textEntered = e.target.value,
  onAdd: (e) => {
    if(listModel.setId){
      addItem(List.textEntered);
      e.target.previousElementSibling.value = '';
    }
  },
  onupdate: vnode => {
    if(vnode.attrs.listId != listModel['setId'])
      getListById(vnode.attrs.listId);
  },
  oninit: (vnode) => {
    if(vnode.attrs.listId) 
      getListById(vnode.attrs.listId);
  },
  view: () => m('div', {class: 'List'}, [
      [...List.content()]
  ])
}; 
export default List;

/*------------------------- HELPER FUNCTIONS -------------------------*/
const getListById = (toSet) => {
  if(toSet){
    if(listModel.setId) socket.off(`${listModel.setId}`);
    listModel.setId = toSet;
    setCookie('previous', listModel.setId);
    m.request({
        url: '/getList',
        method: 'GET',
        params: { listId: listModel.setId }
    })
    .then(r =>{ 
      listModel['items'] = r.items;
      listModel['listTitle'] = r.name;
      List.addArray(listModel['items'] )
    });
    socket.on(`${listModel.setId}`, (list) => {
      listModel['items'] = JSON.parse(list).items;
      listModel['sort'](listModel['items']);
      List.addArray(listModel['items']);
    });
  }
};
const changeColor = i => {
  removeItem(i);
  addItem(i);
}
const addItem = item => {
  setCookie('itemColor', listModel.itemColor);
  setCookie('textColor', listModel.textColor);
  socket.emit('add item', JSON.stringify({
    item,
    id: listModel.setId, 
    color: listModel.itemColor, 
    textColor: listModel.textColor
  }));
}

const removeItem = item => {
  socket.emit('remove item', JSON.stringify({
    item,
    id: listModel.setId
  }));
}

const usedColors = a => {
  const u = (v, i, a) => a.indexOf(v) === i;
  listModel.itemColors = a.map(e => e.color).filter(u).slice(0, 11);
  listModel.textColors = a.map(e => e.textColor).filter(u).slice(0, 11);
}
