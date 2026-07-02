const socketRegistry = require("./socketRegistry");
const presenceService = require("./presenceService");
const roomService = require("./roomService");
const notificationService = require("./notificationService");
const eventDispatcher = require("./eventDispatcher");

class RealtimeService {

    initialize(io) {

        io.on("connection", (socket) => {

            console.log(`🟢 Socket Connected: ${socket.id}`);

            ///////////////////////////////////////////
            // REGISTER USER
            ///////////////////////////////////////////

            socket.on("register", (data) => {

                if (!data?.userId) {
                    return;
                }

                socketRegistry.register({

                    userId: data.userId,

                    socket,

                });

                presenceService.userOnline(
                    data.userId,
                );

            });

            ///////////////////////////////////////////
            // DISCONNECT
            ///////////////////////////////////////////

            socket.on("disconnect", () => {

                const users =
                    socketRegistry.allUsers();

                for (const userId of users) {

                    const client =
                        socketRegistry.get(userId);

                    if (

                        client &&

                        client.socketId === socket.id

                    ) {

                        socketRegistry.unregister(userId);

                        presenceService.userOffline(
                            userId,
                        );

                    }

                }

                console.log(
                    `🔴 Socket Disconnected: ${socket.id}`,
                );

            });

            ///////////////////////////////////////////
            // CHAT
            ///////////////////////////////////////////

            socket.on("chat", (data) => {

                eventDispatcher.chat(data);

            });

            ///////////////////////////////////////////
            // GROUP
            ///////////////////////////////////////////

            socket.on("group", (data) => {

                eventDispatcher.group(data);

            });

            ///////////////////////////////////////////
            // COMMUNITY
            ///////////////////////////////////////////

            socket.on("community", (data) => {

                eventDispatcher.community(data);

            });

            ///////////////////////////////////////////
            // CHANNEL
            ///////////////////////////////////////////

            socket.on("channel", (data) => {

                eventDispatcher.channel(data);

            });

            ///////////////////////////////////////////
            // BROADCAST
            ///////////////////////////////////////////

            socket.on("broadcast", (data) => {

                eventDispatcher.broadcast(data);

            });

            ///////////////////////////////////////////
            // CALL
            ///////////////////////////////////////////

            socket.on("call", (data) => {

                eventDispatcher.call(data);

            });

            ///////////////////////////////////////////
            // STATUS
            ///////////////////////////////////////////

            socket.on("status", (data) => {

                eventDispatcher.status(data);

            });

            ///////////////////////////////////////////
            // NOTIFICATION
            ///////////////////////////////////////////

            socket.on("notification", (data) => {

                eventDispatcher.notification(data);

            });

            ///////////////////////////////////////////
            // JOIN ROOM
            ///////////////////////////////////////////

            socket.on("join-room", (data) => {

                roomService.join(
                    socket,
                    data.room,
                );

            });

            ///////////////////////////////////////////
            // LEAVE ROOM
            ///////////////////////////////////////////

            socket.on("leave-room", (data) => {

                roomService.leave(
                    socket,
                    data.room,
                );

            });

        });

    }

}

module.exports = new RealtimeService();