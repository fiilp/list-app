/**
* Handles interactions with the database. Stores and gets lists.
*
* @author   Filip Garamvölgyi
* @created  2020-05-03
*/
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    "type": process.env.FB_TYPE,
    "project_id": process.env.FB_PROJECT_ID,
    "private_key_id": process.env.FB_PRIVATE_KEY_ID,
    "private_key": process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FB_CLIENT_EMAIL,
    "client_id": process.env.FB_CLIENT_ID,
    "auth_uri": process.env.FB_AUTH_URI,
    "token_uri": process.env.FB_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FB_AUTH_PROVIDER_x509_CERT_URL,
    "client_x509_cert_url": process.env.FB_CLIENT_x509_CERT_URL
  }),
  databaseURL: process.env.FB_DATABASE_URL
});

const db = admin.firestore();

/**
* Returns a list of items.
* @param    list  the name of the list of items to get.
* @returns        retuns list object. {name, lastUsed, items}
*/
const getList = (list) => {
  return db.collection('lists').doc(list).get()
  .then(doc => {
    if(!doc.exists) return undefined;
    else return doc.data();
  })
};

/**
* Sets a list of items
* @param  list  name of the list to set.
* @param  items items to be set in the list.
*/
const setList = (list, items) => {
  if(items.name && items.items)
    db.collection('lists').doc(list).set(items);
};

/**
 * Creates a document in the database for a new list.
 * 
 * @param name  the name of the list (NOT the ID of the list).
 * @returns     a promise that will contain the ID of the document.
 */
const createList = (name) => {
  return db.collection('lists').add({
    name: name,
    items: []
  }).then(docRef => docRef.id);
};
module.exports = {getList, setList, createList};
