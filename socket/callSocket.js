const {
  registerUser,
  removeUser,
  getSocket,
} = require('./userRegistry');

function registerCallSocket(io, socket) {

  /*
  ==========================================
  REGISTER USER
  ==========================================
  */

  socket.on('register', (userId) => {

    registerUser(userId, socket.id);

    console.log(`📞 Call user ${userId} registered`);

  });

  /*
  ==========================================
  START CALL
  ==========================================
  */

  socket.on('start-call', (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit('incoming-call', {

      callId: data.callId,

      callerId: data.callerId,

      receiverId: data.receiverId,

      callType: data.callType,

      callerName: data.callerName,

      callerUsername: data.callerUsername,

      callerPhoto: data.callerPhoto,

      isGroupCall: data.isGroupCall ?? false,

      groupId: data.groupId ?? null,

      groupName: data.groupName ?? "",

      groupPhoto: data.groupPhoto ?? "",

    });

  });

  /*
  ==========================================
  ANSWER CALL
  ==========================================
  */

  socket.on('answer-call', (data) => {

    const callerSocket = getSocket(data.callerId);

    if (!callerSocket) return;

    io.to(callerSocket).emit('call-answered', data);

  });

  /*
  ==========================================
  REJECT CALL
  ==========================================
  */

  socket.on('reject-call', (data) => {

    const callerSocket = getSocket(data.callerId);

    if (!callerSocket) return;

    io.to(callerSocket).emit('call-rejected', data);

  });

  /*
  ==========================================
  END CALL
  ==========================================
  */

  socket.on('end-call', (data) => {

    const otherSocket = getSocket(data.receiverId);

    if (!otherSocket) return;

    io.to(otherSocket).emit('call-ended', data);

  });

  /*
  ==========================================
  WEBRTC OFFER
  ==========================================
  */

  socket.on('webrtc-offer', (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit('webrtc-offer', data);

  });

  /*
  ==========================================
  WEBRTC ANSWER
  ==========================================
  */

  socket.on('webrtc-answer', (data) => {

    const callerSocket = getSocket(data.callerId);

    if (!callerSocket) return;

    io.to(callerSocket).emit('webrtc-answer', data);

  });

  /*
  ==========================================
  ICE CANDIDATE
  ==========================================
  */

  socket.on('ice-candidate', (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit('ice-candidate', data);

  });

  /*
  ==========================================
  MUTE
  ==========================================
  */

  socket.on('toggle-mute', (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit('toggle-mute', data);

  });

  /*
  ==========================================
  CAMERA
  ==========================================
  */

  socket.on('toggle-camera', (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit('toggle-camera', data);

  });

  /*
  ==========================================
  SWITCH CAMERA
  ==========================================
  */

  socket.on('switch-camera', (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit('switch-camera', data);

  });

  /*
  ==========================================
  DISCONNECT
  ==========================================
  */

  socket.on('disconnect', () => {

    removeUser(socket.id);

    console.log(`📞 Call socket disconnected ${socket.id}`);

  });

}

module.exports = registerCallSocket;