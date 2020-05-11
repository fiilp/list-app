import m from 'mithril';
import {
  ColorPicker, 
  ListConnector, 
  } from './../list/list';
import  './menu.css';

let Links = {
  showShare: () => {
    if(window.location.href.includes('?list='))
      return m('div', {class: 'sharable'},[
        m('input', 
          {type: 'text', readonly: 'readonly', id: 'share', value: window.location.href}
        ),
        m('input', {type: 'submit', id: 'share', value: 'Copy URL', onclick: copyURL}),
      ]);
  },
  view: () => m('div',{class: 'links flex d-column a-i-center'},[
    m('p', 'New list'),
    m(ListConnector),
    m(ColorPicker),
    Links.showShare()
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
  view: () => m('div', {class: 'Menu'}, [
      m('div', {class: 'burger', onclick: Menu.toggle}, [
        m('div', {class: 'bar1'}),
        m('div', {class: 'bar2'}),
        m('div', {class: 'bar3'})
      ]),
    Menu.toShow
  ])
};

const copyURL = () => {
  var copyText = document.getElementById("share");
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
};

export default Menu;
