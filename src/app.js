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
    toggle: false,
    content: () => {
      if(!App.toggle) return m(List);
      else return m(Menu);
    },
    view: () => m('div', {class: 'App'}, [
            m(Header, {toggle: () => App.toggle = !App.toggle}),
            m('main', {class: 'flex a-i-center d-column'}, [
              App.content()
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
