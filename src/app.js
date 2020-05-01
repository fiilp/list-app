import m from 'mithril';
import Header from './components/header/header';
import List from './components/list/list';
import './app.css';
var App = {
    view: () => m('div', {class: 'App'}, [
            m(Header),
            m('main', {class: 'flex a-i-center d-column'}, [
              m(List)
            ])
        ]
    )
}; export default App;
