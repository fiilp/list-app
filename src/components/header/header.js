import m from 'mithril';
import Menu from './../menu/menu';
import './header.css';

let Header = {
    view: () => m('div', {class:'Header'},[
        m('h1', 'List collaboration'),
        m(Menu)
    ])
};

export default Header;
