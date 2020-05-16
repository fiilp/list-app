let listModel = {
    listTitle: '',
    itemInput: '',
    listId: '',
    setId: '',
    itemColor: '',
    itemColors: [],
    textColor: '',
    textColors: [],
    items: [],
    createSort: (v, reverse) => {
        listModel.sort = (a) => {
            return a = a.sort((x, y) => {
            if(!reverse === x[v] > y[v]) return 1;
            if(!reverse === x[v] < y[v]) return -1;
            else return 0;
            }); 
        };
    },
    sort: undefined
}
export default listModel;