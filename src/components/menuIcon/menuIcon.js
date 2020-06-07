/**
 * A hamburger menu icon. Uses CSS class "change"
 * to animate. Takes parameter toggle as a function
 * callback when icon is clicked.
 */
import m from 'mithril';
import  './menuIcon.css';

let MenuIcon = {
  toShow: undefined,
  view: (vnode) => m('div', {class: 'MenuIcon'}, [
      m('div', {class: 'burger', onclick: e => {
        vnode.attrs.toggle(); 
        MenuIcon.correctIcon(vnode.attrs.burgerCond, vnode.dom);
      }}, [
        m('div', {class: 'bar1'}),
        m('div', {class: 'bar2'}),
        m('div', {class: 'bar3'})
      ])
  ]),
  oncreate: vnode => MenuIcon.correctIcon(
    vnode.attrs.burgerCond, vnode.dom),
  onupdate: vnode => MenuIcon.correctIcon(
    vnode.attrs.burgerCond, vnode.dom),
  correctIcon: (burgerCond, dom) => {
    const isBurger = !dom.firstElementChild.classList.contains('change');
    //Required to make sure correct icon is displayed when going
    //back and forth in the history
    if(burgerCond && !isBurger)
      dom.firstElementChild.classList.toggle('change');
    else if(!burgerCond && isBurger)
      dom.firstElementChild.classList.toggle('change');
  }
}; export default MenuIcon;
 