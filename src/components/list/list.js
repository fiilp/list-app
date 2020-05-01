import m from 'mithril';
import './list.css';

let itemInput = '';

let ListAdder = {
  view: (vnode) => m('div', {class: 'ListAdder'}, [
    m('input', {type: 'text', oninput: vnode.attrs.oiCb, placeholder: 'Item...'}),
    m('input', {type: 'submit', onclick: vnode.attrs.ocCb, value: '+ Add'})
  ])
};

let ListItem = {

};

let List = {
  textEntered: '',
  items: [],
  onInput: (e) => List.textEntered = e.target.value,
  onAdd: (e) => {
    List.items = [m('p', List.textEntered)].concat(List.items);
    e.target.previousElementSibling.value = '';
    console.log('added: ' + List.textEntered);
    m.redraw();
   },
  view: () => m('div', {class: 'List'}, [
      m(ListAdder, {oiCb: List.onInput, ocCb: List.onAdd}),
      m('div',List.items)
  ])
}; export default List;
