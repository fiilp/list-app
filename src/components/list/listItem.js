import m from 'mithril';
/**
* Component for items added to the list.
*
* @attribute  item  A string with the name of the item to be added.
* @attribute  ocCb  Callback when clicking the remove-button of the item.
*/
let ListItem = {
    tId: undefined,
    onupdate: () => console.log('bordeR: ' + ListItem.border), 
    view: (vnode) => m('div',
    {
      class: 'ListItem flex a-i-center',
      draggable: "true",
      style: `
      background-color: ${vnode.attrs.color};`,
      onmousedown: () => ListItem.tId = setTimeout(() => 
        vnode.attrs.cCol(vnode.attrs.item), 500
      ),onmouseup: () => clearTimeout(ListItem.tId),     
      ontouchstart: () => ListItem.tId = setTimeout(() => 
        vnode.attrs.cCol(vnode.attrs.item), 500
      ),ontouchend: () => clearTimeout(ListItem.tId),
    }, [
      m('p', {style: `color: ${vnode.attrs.textColor}`}, vnode.attrs.item),
      m('button', {onclick: vnode.attrs.ocCb}, 'X')
    ])
  }; export default ListItem;