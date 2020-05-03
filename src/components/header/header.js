import m from 'mithril';
import './header.css';

let Header = {
    view: () => m('div', {class:'Header flex super-center'},[
        m('p', 'List collaboration')
    ])
};

export default Header;
