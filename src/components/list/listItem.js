import m from 'mithril';
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
      style: `background-color: ${vnode.attrs.color};`
    }, [
      m('p', {style: `color: ${vnode.attrs.textColor}`}, vnode.attrs.item),
      m('button', {onclick: vnode.attrs.ocCb}, 'X')
    ])
  }; export default ListItem;