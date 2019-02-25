'use strict'

const Q = require('./lib/server.js');
Q.start();

// database namespace
const db = new Q('database');

// database rooms
db.monitorEvent('create');
db.monitorEvent('update');
db.monitorEvent('destroy');

// setTimeout( ()=>{
//   Q.stop();
// }, 4000);
