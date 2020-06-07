import m from 'mithril';
import MenuIcon from '../menuIcon/menuIcon';
import './header.css';

let Header = {
    view: (vnode) => m('div', {class:'Header'},[
        m('h1', 'List collaboration'),
        m(MenuIcon, {toggle: vnode.attrs.toggle, burgerCond: vnode.attrs.burgerCond})
    ])
};

export default Header;
