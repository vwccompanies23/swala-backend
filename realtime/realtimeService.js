const socketRegistry = require("./socketRegistry");
const presenceService = require("./presenceService");
const roomService = require("./roomService");
const eventDispatcher = require("./eventDispatcher");

class RealtimeService {

    initialize(io) {

      socketRegistry.io = io;

        io.on("connection", (socket) => {

            console.log(`🟢 Socket Connected: ${socket.id}`);

            //////////////////////////////////////////////////////
            // REGISTER USER
            //////////////////////////////////////////////////////

            socket.on("register", ({ userId }) => {

                if (!userId) return;

                socket.userId = String(userId);

                socketRegistry.register({

                    userId,

                    socket,

                });

                presenceService.userOnline(userId);

                console.log(`✅ Registered User ${userId}`);

            });

            //////////////////////////////////////////////////////
            // REGISTER CHAT
            //////////////////////////////////////////////////////

            socket.on("register-chat", (userId) => {

                socket.userId = String(userId);

                socketRegistry.register({

                    userId,

                    socket,

                });

                console.log(`💬 Chat User ${userId} connected`);

            });

          //////////////////////////////////////////////////////
          // SEND MESSAGE
          //////////////////////////////////////////////////////

          socket.on("send-message", (data) => {

              console.log("========== SEND MESSAGE ==========");

              console.log(data);

              eventDispatcher.chat({

                  receiverId: data.receiverId,

                  ...data.message,

              });

          });

          //////////////////////////////////////////////////////
          // TYPING
          //////////////////////////////////////////////////////

          socket.on("typing", (data) => {

              eventDispatcher.chat({

                  receiverId: data.receiverId,

                  senderId: data.senderId,

                  event: "user-typing",

              });

          });

          //////////////////////////////////////////////////////
          // STOP TYPING
          //////////////////////////////////////////////////////

          socket.on("stop-typing", (data) => {

              eventDispatcher.chat({

                  receiverId: data.receiverId,

                  senderId: data.senderId,

                  event: "user-stop-typing",

              });

          });

          //////////////////////////////////////////////////////
          // MESSAGE DELIVERED
          //////////////////////////////////////////////////////

          socket.on("message-delivered", (data) => {

              eventDispatcher.chat({

                  receiverId: data.senderId,

                  event: "message-delivered",

                  ...data,

              });

          });

          //////////////////////////////////////////////////////
          // MESSAGE SEEN
          //////////////////////////////////////////////////////

          socket.on("message-seen", (data) => {

              eventDispatcher.chat({

                  receiverId: data.senderId,

                  event: "message-seen",

                  ...data,

              });

          });

          //////////////////////////////////////////////////////
          // DELETE MESSAGE
          //////////////////////////////////////////////////////

          socket.on("message-deleted", (data) => {

              eventDispatcher.deleteMessage(data);

          });

            //////////////////////////////////////////////////////
            // GROUP
            //////////////////////////////////////////////////////

            socket.on("group", (data) => {

                eventDispatcher.group(data);

            });

            //////////////////////////////////////////////////////
            // COMMUNITY
            //////////////////////////////////////////////////////

            socket.on("community", (data) => {

                eventDispatcher.community(data);

            });

            //////////////////////////////////////////////////////
            // CHANNEL
            //////////////////////////////////////////////////////

            socket.on("channel", (data) => {

                eventDispatcher.channel(data);

            });

            //////////////////////////////////////////////////////
            // BROADCAST
            //////////////////////////////////////////////////////

            socket.on("broadcast", (data) => {

                eventDispatcher.broadcast(data);

            });

           //////////////////////////////////////////////////////
           // CALL USER
           //////////////////////////////////////////////////////

           socket.on("call-user", (data) => {

               eventDispatcher.call(data);

           });

           //////////////////////////////////////////////////////
           // CALL GROUP
           //////////////////////////////////////////////////////

           socket.on("call-group", (data) => {

               eventDispatcher.groupCall(data);

           });

            //////////////////////////////////////////////////////
            // STATUS
            //////////////////////////////////////////////////////

            socket.on("status", (data) => {

                eventDispatcher.status(data);

            });

            //////////////////////////////////////////////////////
            // NOTIFICATION
            //////////////////////////////////////////////////////

            socket.on("notification", (data) => {

                eventDispatcher.notification(data);

            });

            //////////////////////////////////////////////////////
                        // WEBRTC OFFER
                        //////////////////////////////////////////////////////

                        socket.on("webrtc-offer", (data) => {

                            const sockets =
                                socketRegistry.getSockets(
                                    data.receiverId,
                                );

                            for (const socket of sockets) {

                                socket.emit(
                                    "webrtc-offer",
                                    data,
                                );

                            }

                        });

                        //////////////////////////////////////////////////////
                        // WEBRTC ANSWER
                        //////////////////////////////////////////////////////

                        socket.on("webrtc-answer", (data) => {

                            const sockets =
                                socketRegistry.getSockets(
                                    data.receiverId,
                                );

                            for (const socket of sockets) {

                                socket.emit(
                                    "webrtc-answer",
                                    data,
                                );

                            }

                        });

                        //////////////////////////////////////////////////////
                        // ICE CANDIDATE
                        //////////////////////////////////////////////////////

                        socket.on("ice-candidate", (data) => {

                            const sockets =
                                socketRegistry.getSockets(
                                    data.receiverId,
                                );

                            for (const socket of sockets) {

                                socket.emit(
                                    "ice-candidate",
                                    data,
                                );

                            }

                        });

                        //////////////////////////////////////////////////////
                        // ANSWER CALL
                        //////////////////////////////////////////////////////

                        socket.on("call-answered", (data) => {

                            const sockets =
                                socketRegistry.getSockets(
                                    data.callerId,
                                );

                            for (const socket of sockets) {

                                socket.emit(
                                    "call-answered",
                                    data,
                                );

                            }

                        });

                        //////////////////////////////////////////////////////
                        // REJECT CALL
                        //////////////////////////////////////////////////////

                        socket.on("call-rejected", (data) => {

                            const sockets =
                                socketRegistry.getSockets(
                                    data.callerId,
                                );

                            for (const socket of sockets) {

                                socket.emit(
                                    "call-rejected",
                                    data,
                                );

                            }

                        });

                        //////////////////////////////////////////////////////
                        // END CALL
                        //////////////////////////////////////////////////////

                        socket.on("call-ended", (data) => {

                            const sockets =
                                socketRegistry.getSockets(
                                    data.receiverId,
                                );

                            for (const socket of sockets) {

                                socket.emit(
                                    "call-ended",
                                    data,
                                );

                            }

                        });

                        //////////////////////////////////////////////////////
                        // TOGGLE CAMERA
                        //////////////////////////////////////////////////////

                        socket.on("toggle-camera", (data) => {

                            const sockets =
                                socketRegistry.getSockets(
                                    data.receiverId,
                                );

                            for (const socket of sockets) {

                                socket.emit(
                                    "toggle-camera",
                                    data,
                                );

                            }

                        });

                        //////////////////////////////////////////////////////
                        // TOGGLE MUTE
                        //////////////////////////////////////////////////////

                        socket.on("toggle-mute", (data) => {

                            const sockets =
                                socketRegistry.getSockets(
                                    data.receiverId,
                                );

                            for (const socket of sockets) {

                                socket.emit(
                                    "toggle-mute",
                                    data,
                                );

                            }

                        });

                        //////////////////////////////////////////////////////
                        // SWITCH CAMERA
                        //////////////////////////////////////////////////////

                        socket.on("switch-camera", (data) => {

                            const sockets =
                                socketRegistry.getSockets(
                                    data.receiverId,
                                );

                            for (const socket of sockets) {

                                socket.emit(
                                    "switch-camera",
                                    data,
                                );

                            }

                        });

            //////////////////////////////////////////////////////
            // JOIN ROOM
            //////////////////////////////////////////////////////

            socket.on("join-room", ({ room }) => {

                roomService.join(socket, room);

            });

            //////////////////////////////////////////////////////
            // LEAVE ROOM
            //////////////////////////////////////////////////////

            socket.on("leave-room", ({ room }) => {

                roomService.leave(socket, room);

            });

            //////////////////////////////////////////////////////
            // DISCONNECT
            //////////////////////////////////////////////////////

            socket.on("disconnect", () => {

                console.log(`🔴 Socket Disconnected: ${socket.id}`);

                if (socket.userId) {

                    socketRegistry.unregister(

                        socket.userId,

                        socket.id,

                    );

                    if (

                        !socketRegistry.has(socket.userId)

                    ) {

                        presenceService.userOffline(

                            socket.userId,

                        );

                    }

                }

            });

        });

    }

}

module.exports = new RealtimeService();