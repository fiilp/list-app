const listModel = {
    listTitle: '',
    itemInput: '',
    listId: '',
    setId: '',
    itemColor: '',
    itemColors: [],
    textColor: '',
    textColors: [],
    items: [],
    getItemColor: () => listModel.itemColor,
    setItemColor: (c) => listModel.itemColor = c,
    getItemColors: () => listModel.itemColors,
    getTextColors: () => listModel.textColors,
    getTextColor: () => listModel.textColor,
    setTextColor: (c) => listModel.textColor = c,
    createSort: (v, reverse) => {
        listModel.sort = (a) => {
            return a = a.sort((x, y) => {
            if(x[v] > y[v]) return 1 - (2 * reverse);
            else if(x[v] < y[v]) return -1 + (2 * reverse);
            else return 0;
            }); 
        };
    },
    sort: undefined
}
export default listModel;