import m from 'mithril';
import ColorPicker from '../colorPicker/colorPicker';
import listModel from '../../model/listModel';
const ColorPickerM = {
    view: () => m(ColorPicker,{
        setIc: listModel['setItemColor'],
        ic: listModel['itemColor'],
        ics: listModel['itemColors'],
        setTc: listModel['setTextColor'],
        tc: listModel['textColor'],
        tcs: listModel['textColors'],
    })
}; export default ColorPickerM;