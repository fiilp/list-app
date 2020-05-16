import m from 'mithril';
import './sort.css';
 let Sort = {
    reverse: false,
    view: vnode => m('div', {class: 'Sort'}, [
      m('img', {
          src: vnode.attrs.icon,
          onclick: () => {
              vnode.attrs.sort(Sort.reverse); 
              Sort.reverse = !Sort.reverse;
            }
        })  
    ])
 };
 export default Sort;