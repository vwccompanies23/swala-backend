class RoomService {

    //////////////////////////////////////////////////////
    // GENERIC ROOM
    //////////////////////////////////////////////////////

    join(socket, room) {

        socket.join(room);

    }

    leave(socket, room) {

        socket.leave(room);

    }

    //////////////////////////////////////////////////////
    // CHAT
    //////////////////////////////////////////////////////

    joinChat(socket, chatId) {

        this.join(

            socket,

            `chat:${chatId}`,

        );

    }

    leaveChat(socket, chatId) {

        this.leave(

            socket,

            `chat:${chatId}`,

        );

    }

    //////////////////////////////////////////////////////
    // GROUP
    //////////////////////////////////////////////////////

    joinGroup(socket, groupId) {

        this.join(

            socket,

            `group:${groupId}`,

        );

    }

    leaveGroup(socket, groupId) {

        this.leave(

            socket,

            `group:${groupId}`,

        );

    }

    //////////////////////////////////////////////////////
    // BROADCAST
    //////////////////////////////////////////////////////

    joinBroadcast(socket, broadcastId) {

        this.join(

            socket,

            `broadcast:${broadcastId}`,

        );

    }

    leaveBroadcast(socket, broadcastId) {

        this.leave(

            socket,

            `broadcast:${broadcastId}`,

        );

    }

    //////////////////////////////////////////////////////
    // COMMUNITY
    //////////////////////////////////////////////////////

    joinCommunity(socket, communityId) {

        this.join(

            socket,

            `community:${communityId}`,

        );

    }

    leaveCommunity(socket, communityId) {

        this.leave(

            socket,

            `community:${communityId}`,

        );

    }

    //////////////////////////////////////////////////////
    // CHANNEL
    //////////////////////////////////////////////////////

    joinChannel(socket, channelId) {

        this.join(

            socket,

            `channel:${channelId}`,

        );

    }

    leaveChannel(socket, channelId) {

        this.leave(

            socket,

            `channel:${channelId}`,

        );

    }

    //////////////////////////////////////////////////////
    // CALL
    //////////////////////////////////////////////////////

    joinCall(socket, callId) {

        this.join(

            socket,

            `call:${callId}`,

        );

    }

    leaveCall(socket, callId) {

        this.leave(

            socket,

            `call:${callId}`,

        );

    }

    //////////////////////////////////////////////////////
    // EMIT TO ROOM
    //////////////////////////////////////////////////////

    emit(io, room, event, data) {

        io.to(room).emit(

            event,

            data,

        );

    }

}

module.exports = new RoomService();