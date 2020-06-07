import m from 'mithril';
import  './menu.css';
import ListConntectorM from '../modelAdjusted/listConnectorM';
import ColorPickerM from '../modelAdjusted/colorPickerM';
import { getCookie } from '../../utility/cookies';

let MenuOptions = {
    showShare: () => {
        return m('div', {class: 'sharable'},[
            m('input',{
                type: 'text', 
                readonly: 'readonly', 
                id: 'share', 
                value: window.location.origin.concat(`/#!/list/${getCookie('previous')}`)
            }
            ),
            m('input', {type: 'submit', id: 'share', value: 'Copy URL', onclick: copyURL}),
        ]);
    },
    view: () => m('div',{class: 'links flex d-column a-i-center'},[
        m('p', 'New list'),
        m(ListConntectorM),
        m(ColorPickerM),
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