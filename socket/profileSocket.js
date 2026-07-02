const {
  registerUser,
  getSockets,
} = require('./userRegistry');

function registerProfileSocket(io, socket) {

  // Register user for profile updates
  socket.on(
    'register-profile',
    (userId) => {

      registerUser(
        userId,
        socket.id,
      );

      console.log(
        `👤 Profile User ${userId} connected`,
      );

    },
  );

  // Broadcast profile updates
  socket.on(
    'profile-updated',
    (data) => {

      const sockets =
        getSockets(data.userId);

      if (sockets.length === 0) {

        console.log(
          `⚠️ User ${data.userId} is offline`,
        );

        return;

      }

      sockets.forEach((socketId) => {

        io.to(socketId).emit(
          'profile-updated',
          data,
        );

      });

      console.log(
        `✅ Profile updated for user ${data.userId}`,
      );

    },
  );

}

module.exports =
registerProfileSocket;