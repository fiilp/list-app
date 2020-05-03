/**
* Controls REST API requests.
*
* @author   Filip Garamvölgyi
* @created  2020-05-03
*/
const {getList} = require('./../integration/dbIntegration.js');


const apiInit = (app, lists) => {
  getReqs(app, lists);
};

const getReqs = (app, lists) => {
  app.get('/getList', (req, res) => {
    console.log('Requesting list with ID: ' + req.query.listId);
    if(lists[req.query.listId]) res.json(lists[req.query.listId]);
    else
      getList(req.query.listId)
      .then(items => {
        if(!items) {
          res.json([]);
          lists[req.query.listId] = [];
          return;
        }
        lists[req.query.listId] = items;
        res.json(items)
      })
    .catch(err => res.status(500).send('something went wrong..'));
  });
};

module.exports = apiInit;
