import m from 'mithril';
/**
* Component for items added to the list.
*
* @attribute  item  A string with the name of the item to be added.
* @attribute  ocCb  Callback when clicking the remove-button of the item.
*/
let ListItem = {
  tId: undefined,
  vector: undefined,
  inHitbox: undefined,
  colorChange: (e, changeFun, item) => {
    ListItem.inHitbox = hitboxCreator(e.clientX, e.clientY, 15);
    ListItem.tId = setTimeout(() =>{
      changeFun(item)}, 500
    );
  },
  view: (vnode) => m('div',
  {
    class: 'ListItem flex a-i-center',
    draggable: true,
    style: `
    background-color: ${vnode.attrs.color};`,
    onmousedown: e => ListItem.colorChange(e, vnode.attrs.cCol, vnode.attrs.item),
    onmouseup: () => clearTimeout(ListItem.tId),     
    ontouchstart: (e) => ListItem.colorChange(e.touches[0], vnode.attrs.cCol, vnode.attrs.item),
    ontouchend: () => {clearTimeout(ListItem.tId); ListItem.inHitbox=undefined;},
    ontouchmove: (e) => {
      if(ListItem.inHitbox &&
        !ListItem.inHitbox(e.touches[0].clientX, e.touches[0].clientY)) {
        clearTimeout(ListItem.tId);
        ListItem.inHitbox=undefined;
      }
    }
  }, [
    m('p', {style: `color: ${vnode.attrs.textColor}`}, vnode.attrs.item),
    m('button', {onclick: vnode.attrs.ocCb}, 'X')
  ])
}; export default ListItem;

const hitboxCreator = (x0, y0, r) => 
  (x, y) => Math.sqrt(Math.pow(x0-x,2) + Math.pow(y0-y,2)) <= r; 