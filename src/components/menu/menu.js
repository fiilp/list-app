import m from 'mithril';
import  './menu.css';

let Links = {
  view: () => m('div',{class: 'links'},[
    m('a', 'Connect to new list'),
    m('a', 'Create new list'),
    m('a', 'Sign out')
  ])
}
let Menu = {
  toShow: undefined,
  toggle: () => {
    if(!Menu.toShow) Menu.toShow = m(Links);
    else Menu.toShow = undefined;
    m.redraw();
  },
  onupdate: () => console.log(!Menu.toShow),
  view: () => m('div', {class: 'Menu', onclick: Menu.toggle},[
    m('a', {class: 'menu-icon', href: 'javascript:void(0)', }, [
      m('i', {class:'fa fa-bars'})
    ]),
    Menu.toShow
  ])
};

export default Menu;
