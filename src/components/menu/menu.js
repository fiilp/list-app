import m from 'mithril';
import {ColorPicker, ListConnector} from './../list/list';
import  './menu.css';

let Links = {
  view: () => m('div',{class: 'links flex d-column a-i-center'},[
    m('p', 'New list'),
    m(ListConnector),
    m(ColorPicker)
  ])
}
let Menu = {
  toShow: undefined,
  toggle: (e) => {
    if(!Menu.toShow) Menu.toShow = m(Links);
    else Menu.toShow = undefined;
    m.redraw();
    e.currentTarget.classList.toggle('change');
  },
  onupdate: () => console.log(!Menu.toShow),
  view: () => m('div', {class: 'Menu'}, [
      m('div', {class: 'burger', onclick: Menu.toggle}, [
        m('div', {class: 'bar1'}),
        m('div', {class: 'bar2'}),
        m('div', {class: 'bar3'})
      ]),
    Menu.toShow
  ])
};

export default Menu;
