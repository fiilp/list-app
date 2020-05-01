import m from 'mithril';
import './header.css';

let Header = {
    view: () => m('div', {class:'Header flex a-i-center'},[
        m('h1', 'List Collaboration!')
    ])
};

export default Header;
