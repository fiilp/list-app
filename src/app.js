/**
* Contains all the views of the app. Starting point of all the components.
*
* @author   Filip Garamvölgyi
* @created  2020-05-02
*/

import m from 'mithril';
import Header from './components/header/header';
import Menu from './components/menu/menu';
import List from './components/list/list';
import './app.css';


var App = {
    content: (id) => {   
      if(!document.location.hash.includes('#!/menu')) 
        return m(List, {listId: id});
      else return m(Menu);
    },
    view: (vnode) => m('div', {class: 'App'}, [
            m(Header, {toggle: () => {
              if(!document.location.hash.includes('#!/menu')) m.route.set('/menu');
              else window.history.back();
            }, burgerCond: !document.location.hash.includes('#!/menu')}),
            m('main', {class: 'flex a-i-center d-column'}, [
              App.content(vnode.attrs.listid)
            ]),
            m('footer', {class: 'flex d-column'}, [
              m('a', {href: 'https://icons8.com/'}, 'Icons from Icons8'),
              m('div',[
                'Made by: ',
                m('a', {href: 'http://filipg.se'}, 'Filip G')
              ])
            ])
        ]
    )
}; export default App;
