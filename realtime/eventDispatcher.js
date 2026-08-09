const socketRegistry = require("./socketRegistry");
const notificationService = require("./notificationService");

class EventDispatcher {

    //////////////////////////////////////////////////////
    // CHAT (Fixed with diagnostics)
    //////////////////////////////////////////////////////

    chat(data) {
        console.log(`🔍 Dispatching chat message to receiverId: ${data.receiverId}`);

        const sockets = socketRegistry.getSockets(data.receiverId);

        if (!sockets || sockets.length === 0) {
            console.log(`⚠️ WARNING: No active socket found for receiverId: ${data.receiverId}. User might not be registered properly via socket.`);
            return;
        }

        console.log(`📨 Found ${sockets.length} active socket(s) for receiverId: ${data.receiverId}. Emitting 'receive-message'.`);

        for (const socket of sockets) {
            socket.emit("receive-message", data);
        }
    }

    //////////////////////////////////////////////////////
    // DELETE MESSAGE
    //////////////////////////////////////////////////////

    deleteMessage(data) {

        const sockets = socketRegistry.getSockets(data.receiverId);

        for (const socket of sockets) {
            socket.emit("message-deleted", {
                messageId: data.messageId,
            });
        }

    }

    //////////////////////////////////////////////////////
    // GROUP
    //////////////////////////////////////////////////////

    group(data) {

        if (!data.members) return;

        for (const memberId of data.members) {
            const sockets = socketRegistry.getSockets(memberId);
            for (const socket of sockets) {
                socket.emit("group-message", data);
            }
        }

    }

    //////////////////////////////////////////////////////
    // BROADCAST
    //////////////////////////////////////////////////////

    broadcast(data) {

        if (!data.members) return;

        for (const memberId of data.members) {
            const sockets = socketRegistry.getSockets(memberId);
            for (const socket of sockets) {
                socket.emit("broadcast-message", data);
            }
        }

    }

    //////////////////////////////////////////////////////
    // COMMUNITY
    //////////////////////////////////////////////////////

    community(data) {

        if (!data.members) return;

        for (const memberId of data.members) {
            const sockets = socketRegistry.getSockets(memberId);
            for (const socket of sockets) {
                socket.emit("community-update", data);
            }
        }

    }

    //////////////////////////////////////////////////////
    // CHANNEL
    //////////////////////////////////////////////////////

    channel(data) {

        if (!data.members) return;

        for (const memberId of data.members) {
            const sockets = socketRegistry.getSockets(memberId);
            for (const socket of sockets) {
                socket.emit("channel-update", data);
            }
        }

    }

    //////////////////////////////////////////////////////
    // STATUS
    //////////////////////////////////////////////////////

    status(data) {

        if (!data.viewers) return;

        for (const viewerId of data.viewers) {
            const sockets = socketRegistry.getSockets(viewerId);
            for (const socket of sockets) {
                socket.emit("status-update", data);
            }
        }

    }

    //////////////////////////////////////////////////////
    // PRIVATE POST EMITTER
    //////////////////////////////////////////////////////

    _emitPostEvent(event, data) {

        if (!data.viewers || data.viewers.length === 0) return;

        for (const viewerId of data.viewers) {
            const sockets = socketRegistry.getSockets(viewerId);
            for (const socket of sockets) {
                socket.emit(event, data);
            }
        }

    }

    post(data) {
        this._emitPostEvent("post-update", data);
    }

    postLike(data) {
        this._emitPostEvent("post-liked", data);
    }

    postComment(data) {
        this._emitPostEvent("post-commented", data);
    }

    postShare(data) {
        this._emitPostEvent("post-shared", data);
    }

    postDelete(data) {
        this._emitPostEvent("post-deleted", data);
    }

    //////////////////////////////////////////////////////
    // CALL
    //////////////////////////////////////////////////////

    call(data) {

        const sockets = socketRegistry.getSockets(data.receiverId);

        for (const socket of sockets) {
            socket.emit("incoming-call", data);
        }

    }

    //////////////////////////////////////////////////////
    // GROUP CALL
    //////////////////////////////////////////////////////

    groupCall(data) {

        if (!data.members) return;

        for (const memberId of data.members) {
            if (String(memberId) === String(data.callerId)) continue;

            const sockets = socketRegistry.getSockets(memberId);
            for (const socket of sockets) {
                socket.emit("incoming-call", data);
            }
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