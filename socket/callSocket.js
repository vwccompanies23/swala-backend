const {
  registerUser,
  removeUser,
  getSocket,
} = require("./userRegistry");

const pool = require("../config/db");

function registerCallSocket(io, socket) {

  /*
  ==========================================
  REGISTER USER
  ==========================================
  */

  socket.on("register", (userId) => {

    registerUser(userId, socket.id);

    console.log(`📞 User ${userId} registered (${socket.id})`);

  });

  /*
  ==========================================
  START CALL
  ==========================================
  */

  socket.on("call-user", (data) => {

    console.log("========== CALL USER ==========");
    console.log(data);

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) {

      console.log(`❌ Receiver ${data.receiverId} is offline`);

      return;

    }

    io.to(receiverSocket).emit("incoming-call", {

      callId: data.callId,

      callerId: data.callerId,

      receiverId: data.receiverId,

      callType: data.callType,

      callerName: data.callerName ?? "",

      callerUsername: data.callerUsername ?? "",

      callerPhoto: data.callerPhoto ?? "",

      isGroupCall: data.isGroupCall ?? false,

      groupId: data.groupId ?? null,

      groupName: data.groupName ?? "",

      groupPhoto: data.groupPhoto ?? "",

    });

    console.log(
      `✅ Incoming call sent to ${data.receiverId}`
    );

  });

  /*
  ==========================================
  ANSWER CALL
  ==========================================
  */

  socket.on("answer-call", (data) => {

    console.log("========== ANSWER CALL ==========");
    console.log(data);

    const callerSocket = getSocket(data.callerId);

    if (!callerSocket) {

      console.log("❌ Caller socket not found");

      return;

    }

    io.to(callerSocket).emit("call-answered", data);

    console.log("✅ Caller notified");

  });
  socket.on("call-group", async (data) => {

    try {

      const members = await pool.query(
        `
        SELECT user_id
        FROM group_members
        WHERE group_id = $1
        `,
        [data.groupId]
      );

      for (const member of members.rows) {

        if (member.user_id == data.callerId) {
          continue;
        }

        const memberSocket =
          getSocket(member.user_id);

        if (!memberSocket) {
          continue;
        }

        io.to(memberSocket).emit(
          "incoming-call",
          {
            callId: data.callId,
            callerId: data.callerId,
            callType: data.callType,
            callerName: data.callerName,
            callerPhoto: data.callerPhoto,
            isGroupCall: true,
            groupId: data.groupId,
            groupName: data.groupName,
            groupPhoto: data.groupPhoto,
          },
        );

      }

      console.log(
        "✅ Group call sent"
      );

    } catch (e) {

      console.error(e);

    }

  });

  /*
  ==========================================
  REJECT CALL
  ==========================================
  */

  socket.on("reject-call", (data) => {

    console.log("========== REJECT CALL ==========");
    console.log(data);

    const callerSocket = getSocket(data.callerId);

    if (!callerSocket) {

      console.log("❌ Caller socket not found");

      return;

    }

    io.to(callerSocket).emit("call-rejected", data);

    console.log("✅ Caller notified");

  });

  /*
  ==========================================
  END CALL
  ==========================================
  */

  socket.on("end-call", (data) => {

    console.log("========== END CALL ==========");
    console.log(data);

    const callerSocket = getSocket(data.callerId);

    const receiverSocket = getSocket(data.receiverId);

    if (callerSocket) {

      io.to(callerSocket).emit("call-ended", data);

      console.log(`📴 Sent call-ended to caller ${data.callerId}`);

    }

    if (receiverSocket) {

      io.to(receiverSocket).emit("call-ended", data);

      console.log(`📴 Sent call-ended to receiver ${data.receiverId}`);

    }

  });

  /*
  ==========================================
  WEBRTC OFFER
  ==========================================
  */

  socket.on("webrtc-offer", (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit("webrtc-offer", data);

  });

  /*
  ==========================================
  WEBRTC ANSWER
  ==========================================
  */

  socket.on("webrtc-answer", (data) => {

    const callerSocket = getSocket(data.callerId);

    if (!callerSocket) return;

    io.to(callerSocket).emit("webrtc-answer", data);

  });

  /*
  ==========================================
  ICE CANDIDATE
  ==========================================
  */

  socket.on("ice-candidate", (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit("ice-candidate", data);

  });

  /*
  ==========================================
  TOGGLE MUTE
  ==========================================
  */

  socket.on("toggle-mute", (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit("toggle-mute", data);

  });

  /*
  ==========================================
  TOGGLE CAMERA
  ==========================================
  */

  socket.on("toggle-camera", (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit("toggle-camera", data);

  });

  /*
  ==========================================
  SWITCH CAMERA
  ==========================================
  */

  socket.on("switch-camera", (data) => {

    const receiverSocket = getSocket(data.receiverId);

    if (!receiverSocket) return;

    io.to(receiverSocket).emit("switch-camera", data);

  });

  /*
  ==========================================
  DISCONNECT
  ==========================================
  */

  socket.on("disconnect", () => {

    removeUser(socket.id);

    console.log(`🔴 Call socket disconnected ${socket.id}`);

  });

}

module.exports = registerCallSocket;