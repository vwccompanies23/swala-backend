const { getIO } = require('./socketServer');
const { getSocket } = require('./userRegistry');

function emitMessage(receiverId, message) {

  const receiverSocket =
    getSocket(receiverId);

  if (!receiverSocket) {

    console.log(
      `⚠️ User ${receiverId} is offline`
    );

    return;

  }

  getIO()

    .to(receiverSocket)

    .emit(

      'receive-message',

      message,

    );

  console.log(

    `📨 Message sent to user ${receiverId}`

  );

}

function emitTyping(receiverId, data) {

  const receiverSocket =
    getSocket(receiverId);

  if (!receiverSocket) return;

  getIO()

      .to(receiverSocket)

      .emit(

        'user-typing',

        data,

      );

}

function emitStopTyping(receiverId, data) {

  const receiverSocket =
    getSocket(receiverId);

  if (!receiverSocket) return;

  getIO()

      .to(receiverSocket)

      .emit(

        'user-stop-typing',

        data,

      );

}

function emitDelivered(senderId, data) {

  const senderSocket =
    getSocket(senderId);

  if (!senderSocket) return;

  getIO()

      .to(senderSocket)

      .emit(

        'message-delivered',

        data,

      );

}

function emitSeen(senderId, data) {

  const senderSocket =
    getSocket(senderId);

  if (!senderSocket) return;

  getIO()

      .to(senderSocket)

      .emit(

        'message-seen',

        data,

      );

}

module.exports = {

  emitMessage,

  emitTyping,

  emitStopTyping,

  emitDelivered,

  emitSeen,

};