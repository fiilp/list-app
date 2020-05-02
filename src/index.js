/**
* Mounts the single page application to the root HTMLBodyElement.
*
* @author   Filip Garamvölgyi
* @created  2020-05-02
*/

import m from "mithril";
import App from './app.js';

m.mount(document.body.firstElementChild, App);
