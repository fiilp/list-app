/**
* Controls REST API requests.
*
* @author   Filip Garamvölgyi
* @created  2020-05-03
*/
const {getList, createList} = require('./../integration/dbIntegration.js');


const apiInit = (app, lists) => {
  getReqs(app, lists);
  postReqs(app);
};

const getReqs = (app, lists) => {
  app.get('/getList', (req, res) => {
    console.log('Requesting list with ID: ' + req.query.listId);
    if(lists[req.query.listId]) res.json(lists[req.query.listId]);
    else
      getList(req.query.listId)
      .then(list => {
        lists[req.query.listId] = list;
        res.json(list)
      })
    .catch(err => res.status(500).send('something went wrong..'));
  });
};

const postReqs = (app) => {
  app.post('/createList', (req, res) => {
    createList(req.query.listId)
    .then(id => res.status(200).json({id: id}))
    .catch(err => res.status(500).json({result: 'Could not create list.'}))
  });
};

module.exports = apiInit;
