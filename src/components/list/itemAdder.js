import m from 'mithril';
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
}; export default ItemAdder;