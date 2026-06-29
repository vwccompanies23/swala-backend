const registerCallSocket =
require('./callSocket');

const registerChatSocket =
require('./chatSocket');

const registerNotificationSocket =
require('./notificationSocket');

const registerPresenceSocket =
require('./presenceSocket');

function socketEvents(io) {

  io.on('connection', (socket) => {

    console.log(
      `🟢 Socket Connected: ${socket.id}`
    );

    registerCallSocket(
      io,
      socket,
    );

    registerChatSocket(
      io,
      socket,
    );

    registerNotificationSocket(
      io,
      socket,
    );

    registerPresenceSocket(
      io,
      socket,
    );


    socket.on('disconnect', () => {

      console.log(
        `🔴 Socket Disconnected: ${socket.id}`
      );

    });

  });

}

module.exports = socketEvents;