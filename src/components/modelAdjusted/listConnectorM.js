import m from 'mithril';
import listModel from '../../model/listModel';
import ListConntector from '../list/listConnector';
/**
 * ListConnector component adjusted to use ListModel
 */
const ListConntectorM = {
    view: () => m(ListConntector, {
        oi: e => listModel.listId = e.target.value,
        oc: () => {
          if(listModel.listId){
            console.log(listModel);
            
            m.redraw();
            createList(listModel.listId);
          }
        },
      })
}; export default ListConntectorM;

const createList = (toSet) => {
  console.log('create list???');
  m.request({
    url: '/createList',
    method: 'POST',
    headers: {
      redirect: 'follow'
    },
    params: { listId: toSet }
  })
  .then(id =>
    window.location.href = window.location.origin.concat(`/?list=${id.id}`)
  );
}