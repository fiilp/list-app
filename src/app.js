import m from 'mithril';
import Header from './components/header/header'
var App = {
    view: () => m('div', {class: 'App'}, [
            m(Header)
        ]
    )
};
export default App;
