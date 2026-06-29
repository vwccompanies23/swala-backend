const {
  registerUser,
  removeUser,
  getUsers,
} = require('./userRegistry');

function registerPresenceSocket(io, socket) {

  // Register online user
  socket.on('register-presence', (userId) => {

    registerUser(
      userId,
      socket.id,
    );

    console.log(
      `🟢 User ${userId} is online`
    );

    io.emit(
      'user-online',
      {
        userId,
      },
    );

  });

  // Disconnect
  socket.on('disconnect', () => {

    let disconnectedUser = null;

    getUsers().forEach((value, key) => {

      if (value === socket.id) {

        disconnectedUser = key;

      }

    });

    removeUser(socket.id);

    if (disconnectedUser !== null) {

      console.log(
        `🔴 User ${disconnectedUser} is offline`
      );

      io.emit(
        'user-offline',
        {
          userId: disconnectedUser,
        },
      );

    }

  });

}

module.exports = registerPresenceSocket;