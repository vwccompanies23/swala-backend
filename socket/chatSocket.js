const {
  registerUser,
  getSocket,
} = require('./userRegistry');

function registerChatSocket(io, socket) {

  // Register chat user
  socket.on('register-chat', (userId) => {

    registerUser(
      userId,
      socket.id,
    );

    console.log(
      `💬 Chat User ${userId} connected`
    );

  });

  // Send message
  socket.on('send-message', (data) => {

    const receiverSocket =
      getSocket(data.receiverId);

    if (receiverSocket) {

      io.to(receiverSocket).emit(
        'receive-message',
        data,
      );

    }

  });

  // Typing
  socket.on('typing', (data) => {

    const receiverSocket =
      getSocket(data.receiverId);

    if (receiverSocket) {

      io.to(receiverSocket).emit(
        'user-typing',
        data,
      );

    }

  });

  // Stop typing
  socket.on('stop-typing', (data) => {

    const receiverSocket =
      getSocket(data.receiverId);

    if (receiverSocket) {

      io.to(receiverSocket).emit(
        'user-stop-typing',
        data,
      );

    }

  });

  // Message delivered
  socket.on('message-delivered', (data) => {

    const senderSocket =
      getSocket(data.senderId);

    if (senderSocket) {

      io.to(senderSocket).emit(
        'message-delivered',
        data,
      );

    }

  });

  // Message seen
  socket.on('message-seen', (data) => {

    const senderSocket =
      getSocket(data.senderId);

    if (senderSocket) {

      io.to(senderSocket).emit(
        'message-seen',
        data,
      );

    }

  });

}

module.exports = registerChatSocket;