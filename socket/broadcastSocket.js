const pool = require('../config/db');

module.exports = (io, socket) => {

  /////////////////////////////////////////////////////
  // Join Broadcast
  /////////////////////////////////////////////////////

  socket.on(

    'join-broadcast',

    ({ broadcastId }) => {

      socket.join(

        `broadcast-${broadcastId}`

      );

      console.log(

        `📢 ${socket.id} joined broadcast ${broadcastId}`

      );

    },

  );

  /////////////////////////////////////////////////////
  // Leave Broadcast
  /////////////////////////////////////////////////////

  socket.on(

    'leave-broadcast',

    ({ broadcastId }) => {

      socket.leave(

        `broadcast-${broadcastId}`

      );

      console.log(

        `📢 ${socket.id} left broadcast ${broadcastId}`

      );

    },

  );

  /////////////////////////////////////////////////////
  // Send Broadcast Message
  /////////////////////////////////////////////////////

  socket.on(

    'broadcast-message',

    (message) => {

      io.to(

        `broadcast-${message.broadcastId}`

      ).emit(

        'broadcast-message',

        message,

      );

    },

  );

  /////////////////////////////////////////////////////
  // Edit Message
  /////////////////////////////////////////////////////

  socket.on(

    'broadcast-message-edited',

    (message) => {

      io.to(

        `broadcast-${message.broadcastId}`

      ).emit(

        'broadcast-message-edited',

        message,

      );

    },

  );

  /////////////////////////////////////////////////////
  // Delete Message
  /////////////////////////////////////////////////////

  socket.on(

    'broadcast-message-deleted',

    (message) => {

      io.to(

        `broadcast-${message.broadcastId}`

      ).emit(

        'broadcast-message-deleted',

        message,

      );

    },

  );

  /////////////////////////////////////////////////////
  // Read Receipt
  /////////////////////////////////////////////////////

  socket.on(

    'broadcast-message-read',

    (data) => {

      io.to(

        `broadcast-${data.broadcastId}`

      ).emit(

        'broadcast-message-read',

        data,

      );

    },

  );

  /////////////////////////////////////////////////////
  // Reaction
  /////////////////////////////////////////////////////

  socket.on(

    'broadcast-reaction',

    (reaction) => {

      io.to(

        `broadcast-${reaction.broadcastId}`

      ).emit(

        'broadcast-reaction',

        reaction,

      );

    },

  );

  /////////////////////////////////////////////////////
  // Member Added
  /////////////////////////////////////////////////////

  socket.on(

    'broadcast-member-added',

    (member) => {

      io.to(

        `broadcast-${member.broadcastId}`

      ).emit(

        'broadcast-member-added',

        member,

      );

    },

  );

  /////////////////////////////////////////////////////
  // Member Removed
  /////////////////////////////////////////////////////

  socket.on(

    'broadcast-member-removed',

    (member) => {

      io.to(

        `broadcast-${member.broadcastId}`

      ).emit(

        'broadcast-member-removed',

        member,

      );

    },

  );

  /////////////////////////////////////////////////////
  // Broadcast Updated
  /////////////////////////////////////////////////////

  socket.on(

    'broadcast-updated',

    (broadcast) => {

      io.to(

        `broadcast-${broadcast.id}`

      ).emit(

        'broadcast-updated',

        broadcast,

      );

    },

  );

  /////////////////////////////////////////////////////
  // Broadcast Deleted
  /////////////////////////////////////////////////////

  socket.on(

    'broadcast-deleted',

    (broadcastId) => {

      io.to(

        `broadcast-${broadcastId}`

      ).emit(

        'broadcast-deleted',

        {

          broadcastId,

        },

      );

    },

  );

};