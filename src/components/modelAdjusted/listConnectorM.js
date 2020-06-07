import m from 'mithril';
import listModel from '../../model/listModel';
import ListConntector from '../list/listConnector';
/**
 * ListConnector component adjusted to use ListModel
 */
const ListConntectorM = {
    view: () => m(ListConntector, {
        oi: e => listModel.listId = e.target.value,
        oc: (cb) => {
          if(listModel.listId){
            createList(listModel.listId,() => {
              cb();
            });
          }
        },
      })
}; export default ListConntectorM;

const createList = (toSet, cb) => {
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
    m.route.set(`/list/${id.id}`)
  ).then(cb);
}