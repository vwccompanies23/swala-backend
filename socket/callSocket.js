const {
  registerUser,
  removeUser,
  getSocket,
} = require('./userRegistry');

function registerCallSocket(io, socket) {

  // Register user
  socket.on('register', (userId) => {

    registerUser(
      userId,
      socket.id,
    );

    console.log(
      `📞 Call user ${userId} registered`
    );

  });

  // Call user
  socket.on('call-user', (data) => {

    const receiverSocket =
      getSocket(data.receiverId);

    if (receiverSocket) {

      io.to(receiverSocket).emit(
        'incoming-call',
        data,
      );

    }

  });

  // Answer call
  socket.on('answer-call', (data) => {

    const callerSocket =
      getSocket(data.callerId);

    if (callerSocket) {

      io.to(callerSocket).emit(
        'call-answered',
        data,
      );

    }

  });

  // Reject call
  socket.on('reject-call', (data) => {

    const callerSocket =
      getSocket(data.callerId);

    if (callerSocket) {

      io.to(callerSocket).emit(
        'call-rejected',
        data,
      );

    }

  });

  // End call
  socket.on('end-call', (data) => {

    const otherSocket =
      getSocket(data.otherUserId);

    if (otherSocket) {

      io.to(otherSocket).emit(
        'call-ended',
        data,
      );

    }

  });

  // WebRTC Offer
  socket.on('webrtc-offer', (data) => {

    const receiverSocket =
      getSocket(data.receiverId);

    if (receiverSocket) {

      io.to(receiverSocket).emit(
        'webrtc-offer',
        data,
      );

    }

  });

  // WebRTC Answer
  socket.on('webrtc-answer', (data) => {

    const callerSocket =
      getSocket(data.callerId);

    if (callerSocket) {

      io.to(callerSocket).emit(
        'webrtc-answer',
        data,
      );

    }

  });

  // ICE Candidate
  socket.on('ice-candidate', (data) => {

    const receiverSocket =
      getSocket(data.receiverId);

    if (receiverSocket) {

      io.to(receiverSocket).emit(
        'ice-candidate',
        data,
      );

    }

  });

  // Toggle Mute
  socket.on('toggle-mute', (data) => {

    const receiverSocket =
      getSocket(data.receiverId);

    if (receiverSocket) {

      io.to(receiverSocket).emit(
        'toggle-mute',
        data,
      );

    }

  });

  // Toggle Camera
  socket.on('toggle-camera', (data) => {

    const receiverSocket =
      getSocket(data.receiverId);

    if (receiverSocket) {

      io.to(receiverSocket).emit(
        'toggle-camera',
        data,
      );

    }

  });

  // Switch Camera
  socket.on('switch-camera', (data) => {

    const receiverSocket =
      getSocket(data.receiverId);

    if (receiverSocket) {

      io.to(receiverSocket).emit(
        'switch-camera',
        data,
      );

    }

  });

  socket.on('disconnect', () => {

    removeUser(socket.id);

    console.log(
      `📞 Call socket disconnected ${socket.id}`
    );

  });

}

module.exports = registerCallSocket;