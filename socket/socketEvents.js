const registerCallSocket =
require("./callSocket");

const registerChatSocket =
require("./chatSocket");

const registerNotificationSocket =
require("./notificationSocket");

const registerPresenceSocket =
require("./presenceSocket");

const registerProfileSocket =
require("./profileSocket");

const registerBroadcastSocket =
require("./broadcastSocket");

const {
    removeUser,
} = require("./userRegistry");

function socketEvents(io) {

    io.on("connection", (socket) => {

        console.log(
            `🟢 Socket Connected: ${socket.id}`,
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

        registerProfileSocket(
            io,
            socket,
        );

        registerBroadcastSocket(
            io,
            socket,
        );

        socket.on("disconnect", () => {

            removeUser(socket.id);

            console.log(
                `🔴 Socket Disconnected: ${socket.id}`,
            );

        });

    });

}

module.exports = socketEvents;