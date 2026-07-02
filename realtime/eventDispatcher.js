const socketRegistry = require("./socketRegistry");
const notificationService = require("./notificationService");

class EventDispatcher {

    //////////////////////////////////////////////////////
    // CHAT
    //////////////////////////////////////////////////////

    chat(data) {

        const socket = socketRegistry.getSocket(
            data.receiverId,
        );

        if (socket) {

            socket.emit(
                "receive-message",
                data,
            );

        }

    }

    //////////////////////////////////////////////////////
    // GROUP
    //////////////////////////////////////////////////////

    group(data) {

        if (!data.members) {
            return;
        }

        for (const memberId of data.members) {

            const socket =
                socketRegistry.getSocket(
                    memberId,
                );

            if (socket) {

                socket.emit(
                    "group-message",
                    data,
                );

            }

        }

    }

    //////////////////////////////////////////////////////
    // BROADCAST
    //////////////////////////////////////////////////////

    broadcast(data) {

        if (!data.members) {
            return;
        }

        for (const memberId of data.members) {

            const socket =
                socketRegistry.getSocket(
                    memberId,
                );

            if (socket) {

                socket.emit(
                    "broadcast-message",
                    data,
                );

            }

        }

    }

    //////////////////////////////////////////////////////
    // COMMUNITY
    //////////////////////////////////////////////////////

    community(data) {

        if (!data.members) {
            return;
        }

        for (const memberId of data.members) {

            const socket =
                socketRegistry.getSocket(
                    memberId,
                );

            if (socket) {

                socket.emit(
                    "community-update",
                    data,
                );

            }

        }

    }

    //////////////////////////////////////////////////////
    // CHANNEL
    //////////////////////////////////////////////////////

    channel(data) {

        if (!data.members) {
            return;
        }

        for (const memberId of data.members) {

            const socket =
                socketRegistry.getSocket(
                    memberId,
                );

            if (socket) {

                socket.emit(
                    "channel-update",
                    data,
                );

            }

        }

    }

    //////////////////////////////////////////////////////
    // STATUS
    //////////////////////////////////////////////////////

    status(data) {

        if (!data.viewers) {
            return;
        }

        for (const viewerId of data.viewers) {

            const socket =
                socketRegistry.getSocket(
                    viewerId,
                );

            if (socket) {

                socket.emit(
                    "status-update",
                    data,
                );

            }

        }

    }

    //////////////////////////////////////////////////////
    // CALL
    //////////////////////////////////////////////////////

    call(data) {

        const socket =
            socketRegistry.getSocket(
                data.receiverId,
            );

        if (socket) {

            socket.emit(
                "incoming-call",
                data,
            );

        }

    }

    //////////////////////////////////////////////////////
    // NOTIFICATION
    //////////////////////////////////////////////////////

    notification(data) {

        notificationService.sendToUser({

            userId: data.userId,

            event: data.event,

            data: data.payload,

        });

    }

}

module.exports = new EventDispatcher();