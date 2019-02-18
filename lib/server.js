'use strict';
const util = require('util');
require('dotenv').config()
let Server = require('socket.io');

class Q {
  constructor(namespace){
    this.validRooms = [];
    this.namespace = namespace;
    this.adminNamespace = Q.io.of(`/${namespace}`);
    
    this.adminNamespace.on('connect', (socket)=> {
      socket.on('join', (room, cb) => {
        let newFunction = this.handleJoin.bind(this, room, socket);
        newFunction(room, socket);
      });
    });

    Q.io.on('connect', (socket) => {
      socket.on('publish', (namespace, room, payload) => {
        this.adminNamespace.to(room).emit(room, payload);
      });
    });
  }
  
  monitorEvent(room){
    this.validRooms.push(room);
  }

  static start(){
    let PORT = process.env.PORT;
    Q.io = new Server(PORT);
    console.log(`Q server up on port ${PORT}`);
  }

  static stop(){
    Q.io.close();
  }

  handleJoin(room, socket){
    if (this.validRooms.includes(room)){
      console.log(`Server: Connecting a user to room: ${room}, in namespace: ${this.namespace}`);
      socket.join(room);
    } else {
      console.log(`Server: Rejecting a user from room: ${room}, in namespace: ${this.namespace}`);
    }
  }
}

module.exports = Q;
