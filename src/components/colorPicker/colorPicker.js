import m from 'mithril';

let RecentColors = {
    view: vnode => m('div', {class: 'RecentColors flex'}, [
      vnode.attrs.source.map(c => m('div',{ 
        class: 'color',
        style: `background-color: ${c}`,
        onclick: vnode.attrs.oc
      }))
    ])
  }

/**
 * Used to pick a color
 */
let ColorPicker = {
    toHex: (rgb) => {
      const h = '#'.concat(
        rgb.substring(4, rgb.length-1)
        .replace(/ /g, '')
        .split(',')
        .map(e => parseInt(e, 10))
        .map(e => e.toString(16))
        .map(e => e.length < 2 ? '0'.concat(e) : e)
        .reduce((a,b) => a+b)
      );
      return h;
    },
    view: (vnode) => m('div', {class: 'ColorPicker'}, [
      m('div', {class: 'picker'}, [
        'Pick background color: ',
        m('input', {type: 'color', value: vnode.attrs.ic, oninput: e => vnode.attrs.setIc(e.target.value)})
      ]),
      m(RecentColors, {source: vnode.attrs.ics, oc: e => vnode.attrs.setIc(ColorPicker.toHex(e.target.style.backgroundColor))}),
      m('div', {class: 'picker'}, [
        'Pick text color: ',
        m('input', {type: 'color', value: vnode.attrs.tc, oninput: e=> vnode.attrs.setTc(e.target.value)}),
      ]),
      m(RecentColors, {source: vnode.attrs.tcs, oc: e =>  vnode.attrs.setTc(ColorPicker.toHex(e.target.style.backgroundColor))}),
    ])
  }; export default ColorPicker;