const {
  registerUser,
  getSocket,
} = require('./userRegistry');

function registerChatSocket(io, socket) {

  console.log("🔥 registerChatSocket attached to", socket.id);

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
 socket.on("send-message", (data) => {

   console.log("========== SEND MESSAGE ==========");
   console.log(data);

   const receiverSocket = getSocket(data.receiverId);

   if (!receiverSocket) {

     console.log(`❌ Receiver ${data.receiverId} is offline`);

     return;

   }

   io.to(receiverSocket).emit(
     "receive-message",
     data.message,
   );

   console.log(`✅ Message sent to ${data.receiverId}`);

 });

  // Typing
socket.on('typing', (data) => {

  const receiverSocket =
      getSocket(data.receiverId);

  if (receiverSocket) {

    io.to(receiverSocket).emit(

      'user-typing',

      {

        senderId: data.senderId,

        receiverId: data.receiverId,

      },

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

       {

         senderId: data.senderId,

         receiverId: data.receiverId,

       },

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
  //////////////////////////////////////////////////////
    // DELETE MESSAGE
    //////////////////////////////////////////////////////

    socket.on("message-deleted", (data) => {

      const receiverSocket =
          getSocket(data.receiverId);

      if (receiverSocket) {

        io.to(receiverSocket).emit(

          "message-deleted",

          {

            messageId: data.messageId,

          },

        );

      }

    });
}


module.exports = registerChatSocket;