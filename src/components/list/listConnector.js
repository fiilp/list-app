import m from 'mithril';

/**
* Used to connect to a list based on ID.
*/
let ListConnector = {
    // TODO: Have oninput and onclick as attributes for more flexiblity.
    loading: false,
    displayLoading: () =>  m('p', 'LOADING LIST...'),
    content: (attrs) => { 
  
      if(!ListConnector.loading)
        return [
          m('input', {type: 'text', oninput: attrs.oi, placeholder: 'Name...'}),
          m('input', {type: 'submit', onclick: () => {attrs.oc(); ListConnector.loading = true;}, value: 'Create'})
        ]
      else return ListConnector.displayLoading();
    },
    view: (vnode) => m('div', {class: 'ListConnector flex super-center'},
      ListConnector.content(vnode.attrs)
    )
  }; export default ListConnector;