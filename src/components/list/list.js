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

let listTitle = '';
let itemInput = '';
let listId = '';
let setId = '';
let itemColor = getCookie('itemColor') || '#ffffff';
let recentItemColors = [];
let textColor = getCookie('textColor') || '#000000';
let recentTextColors = [];


/**
 * Used to pick color of list item.
 */
let ColorPicker = {
  recentItemColors: () => undefined,
  pickText: e=> textColor = e.target.value,
  pickItem: e => itemColor = e.target.value,
  view: () => m('div', {class: 'ColorPicker'}, [
    m('div', {class: 'picker'}, [
      'Pick background color: ',
      m('input', {type: 'color', value: itemColor, oninput: ColorPicker.pickItem})
    ]),
    m('div', {class: 'picker'}, [
      'Pick text color: ',
      m('input', {type: 'color', value: textColor, oninput: ColorPicker.pickText}),
    ]),
  ])
};

/**
* Used to connect to a list based on ID.
*/
let ListConnector = {
  // TODO: Have oninput and onclick as attributes for more flexiblity.
  loading: false,
  displayLoading: () =>  m('p', 'LOADING LIST...'),
  content: (vnode) => { 
    console.log('about to');
    
    if(!vnode.state.loading)
      return [
        m('input', {type: 'text', text: setId, oninput: ListConnector.oi, placeholder: 'Name...'}),
        m('input', {type: 'submit', onclick: () => {ListConnector.oc(vnode)}, value: 'Create'})
      ]
    else return ListConnector.displayLoading();
  },
  oi: e => listId = e.target.value,
  oc: vnode => {
    if(listId){
      //vnode.state.loading = true;
      console.log(vnode);
      m.redraw();
      createList(listId);
    }
  },
  oninit: () => console.log('created'),
  onremove: () => console.log('was removed'),
  view: (vnode) => m('div', {class: 'ListConnector flex super-center'},
    ListConnector.content(vnode)
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
    style: `background-color: ${vnode.attrs.color || itemColor};`
  }, [
    m('p', {style: `color: ${vnode.attrs.textColor || textColor}`}, vnode.attrs.item),
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
    if(setId){
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
    setId = toSet;
    setCookie('previous', setId);
    m.request({
        url: '/getList',
        method: 'GET',
        params: { listId: setId }
    })
    .then(r => List.addArray(r.items));
    socket.on(`${setId}`, (list) => {
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
  setCookie('itemColor', itemColor);
  setCookie('textColor', textColor);
  socket.emit('add item', JSON.stringify({item, id: setId, color: itemColor, textColor}));
}

const removeItem = item => {
  socket.emit('remove item', JSON.stringify({
    item,
    id: setId
  }));
}

const removeListSubscribtion = (r) => {
  socket.off(r); // stops listening to the "news" event
};