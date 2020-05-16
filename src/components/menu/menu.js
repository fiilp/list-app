import m from 'mithril';
import {
  ColorPicker, 
  ListConnector, 
  } from '../list/list';
import  './menu.css';

let MenuOptions = {
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
        MenuOptions.showShare()
    ])
};

let Menu = {
    view: () => m('div', {class: 'Menu'}, [
        m(MenuOptions)
    ])
}

export default Menu;

const copyURL = () => {
var copyText = document.getElementById("share");
copyText.select();
copyText.setSelectionRange(0, 99999)
document.execCommand("copy");
};