const { Server } = require('socket.io');

let io;

function initializeSocket(server) {

  io = new Server(server, {

    cors: {

      origin: '*',

      methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
      ],

      credentials: true,

    },

    transports: [
      'websocket',
      'polling',
    ],

    pingTimeout: 60000,

    pingInterval: 25000,

  });

  console.log(
    '✅ Socket.IO initialized'
  );

  return io;

}

function getIO() {

  if (!io) {

    throw new Error(
      'Socket.IO not initialized.'
    );

  }

  return io;

}

module.exports = {

  initializeSocket,

  getIO,

};