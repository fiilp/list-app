import m from 'mithril';
import './header.css';

let Header = {
    view: () => m('div', {class:'Header flex super-center'},[
        m('h1', 'List collaboration!')
    ])
};

export default Header;
