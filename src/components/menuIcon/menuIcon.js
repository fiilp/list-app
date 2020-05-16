import m from 'mithril';
import  './menuIcon.css';

let MenuIcon = {
  toShow: undefined,
  toggle: (e) => {
    e.currentTarget.classList.toggle('change');
  },
  view: (vnode) => m('div', {class: 'MenuIcon'}, [
      m('div', {class: 'burger', onclick: e => {MenuIcon.toggle(e); vnode.attrs.toggle()}}, [
        m('div', {class: 'bar1'}),
        m('div', {class: 'bar2'}),
        m('div', {class: 'bar3'})
      ])
  ])
};

export default MenuIcon;
