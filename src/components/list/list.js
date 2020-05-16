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
import listModel from '../../model/listModel';

const socket = io();

listModel['itemColor'] = getCookie('itemColor') || '#ffffff';
listModel['textColor'] = getCookie('textColor') || '#000000';

let RecentColors = {
  view: vnode => m('div', {class: 'RecentColors flex'}, [
    vnode.attrs.source.map(c => m('div',{ 
      class: 'color',
      style: `background-color: ${c}`,
      onclick: vnode.attrs.oc
    }))
  ])
}

/**
 * Used to pick color of list item.
 */
let ColorPicker = {
  toHex: (rgb) => '#'.concat(
    rgb.substring(4, rgb.length-1)
    .replace(/ /g, '')
    .split(',')
    .map(e => parseInt(e, 10))
    .map(e => e.toString(16))
    .reduce((a,b) => a+b)
  ),
  pickText: e=> listModel['textColor'] = e.target.value,
  recentText: e => listModel['textColor'] = ColorPicker.toHex(e.target.style.backgroundColor),
  pickItem: e => listModel['itemColor'] = e.target.value,
  recentItem: e => listModel['itemColor'] = ColorPicker.toHex(e.target.style.backgroundColor),
  view: () => m('div', {class: 'ColorPicker'}, [
    m('div', {class: 'picker'}, [
      'Pick background color: ',
      m('input', {type: 'color', value: listModel['itemColor'], oninput: ColorPicker.pickItem})
    ]),
    m(RecentColors, {source: listModel['itemColors'], oc: ColorPicker.recentItem}),
    m('div', {class: 'picker'}, [
      'Pick text color: ',
      m('input', {type: 'color', value: listModel['textColor'], oninput: ColorPicker.pickText}),
    ]),
    m(RecentColors, {source: listModel['textColors'], oc: ColorPicker.recentText}),
  ])
};

/**
* Used to connect to a list based on ID.
*/
let ListConnector = {
  // TODO: Have oninput and onclick as attributes for more flexiblity.
  loading: false,
  displayLoading: () =>  m('p', 'LOADING LIST...'),
  content: (state) => { 

    if(!ListConnector.loading)
      return [
        m('input', {type: 'text', oninput: ListConnector.oi, placeholder: 'Name...'}),
        m('input', {type: 'submit', onclick: ListConnector.oc, value: 'Create'})
      ]
    else return ListConnector.displayLoading();
  },
  oi: e => listModel.listId = e.target.value,
  oc: () => {
    if(listModel.listId){
      ListConnector.loading = true;
      m.redraw();
      createList(listModel.listId);
    }
  },
  view: (vnode) => m('div', {class: 'ListConnector flex super-center'},
    ListConnector.content(vnode.state)
  )
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
  view: (vnode) => m('div', 
  {
    class: 'ListItem flex a-i-center',
    draggable: "true",
    style: `background-color: ${vnode.attrs.color || listModel.itemColor};`
  }, [
    m('p', {style: `color: ${vnode.attrs.textColor || listModel['textColor']}`}, vnode.attrs.item),
    m('button', {onclick: vnode.attrs.ocCb}, 'X')
  ])
};

/**
* Renders all the components needed for the list
*/
let List = {
  inList: false,
  textEntered: '',
  items: [],
  content: () => {
    if(List.inList)
      return [
        m('h2', listModel['listTitle']),
        m(ItemAdder, {oiCb: List.onInput, ocCb: List.onAdd}),
        m('div', {class: 'items flex a-i-center d-column'}, List.items)
      ]; 
    else {
      let content = [m(ListConnector)];
      if(getCookie('previous'))
      content = content.concat(
          m('a', {href: `/?list=${getCookie('previous')}`}, 'Recent list'));
      return content.concat(
        m('p', {class: 'desc'}, 'Every new list creates a unique URL. Share the URL to collaborate with others on your list.')
      ); 
    };  
  },
  addArray: (a) => {
    usedColors(a);
    List.items = a.map( i => m(
      ListItem, 
      {
        item: i.item, 
        textColor: i.textColor, 
        color: i.color,
        ocCb: List.onRemove
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
  oninit: () => {
    const params = location.search.split('=');
    List.inList = params[0] === '?list';
    if(List.inList) getListById(params[1]);
  },
  view: () => m('div', {class: 'List'}, [
      [...List.content()]
  ])
}; 
export default List;
export {ColorPicker, ListConnector};

/*------------------------- HELPER FUNCTIONS -------------------------*/
const getListById = (toSet) => {
  if(toSet){
    listModel.setId = toSet;
    setCookie('previous', listModel.setId);
    m.request({
        url: '/getList',
        method: 'GET',
        params: { listId: listModel.setId }
    })
    .then(r =>{ 
      listModel['listTitle'] = r.name;
      List.addArray(r.items)
    });
    socket.on(`${listModel.setId}`, (list) => {
      List.addArray(JSON.parse(list).items);
    });
  }
};

const createList = (toSet) => {
  m.request({
    url: '/createList',
    method: 'POST',
    headers: {
      redirect: 'follow'
    },
    params: { listId: toSet }
  })
  .then(id =>
    window.location.href = window.location.origin.concat(`/?list=${id.id}`)
  );
}

const addItem = item => {
  setCookie('itemColor', listModel.itemColor);
  setCookie('textColor', listModel.textColor);
  debugger;
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

const removeListSubscribtion = (r) => {
  socket.off(r); // stops listening to the "news" event
};

const usedColors = a => {
  const u = (v, i, a) => a.indexOf(v) === i;
  listModel.itemColors = a.map(e => e.color).filter(u).slice(0, 11);
  listModel.textColors = a.map(e => e.textColor).filter(u).slice(0, 11);
}