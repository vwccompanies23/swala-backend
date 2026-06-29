const {
  registerUser,
  getSocket,
  getSockets,
} = require('./userRegistry');

function registerNotificationSocket(io, socket) {

  // Register notification user
  socket.on(
    'register-notification',
    (userId) => {

      registerUser(
        userId,
        socket.id,
      );

      console.log(
        `🔔 Notification User ${userId} connected`
      );

    },
  );

  // Send notification
  socket.on(
    'send-notification',
    (data) => {

      const receiverSockets =
        getSockets(data.receiverId);

      receiverSockets.forEach((socketId) => {

        io.to(socketId).emit(
          'new-notification',
          data,
        );

      });

    },
  );

}

module.exports =
registerNotificationSocket;