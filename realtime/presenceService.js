const pool = require("../config/db");
const socketRegistry = require("./socketRegistry");

class PresenceService {

    //////////////////////////////////////////////////////
    // USER ONLINE
    //////////////////////////////////////////////////////

    async userOnline(userId) {

        try {

            await pool.query(

                `
                UPDATE users
                SET
                    is_online = TRUE,
                    last_seen = NOW()
                WHERE id = $1
                `,

                [userId],

            );

            this.broadcastPresence({

                userId,

                isOnline: true,

            });

        } catch (error) {

            console.error(error);

        }

    }

    //////////////////////////////////////////////////////
    // USER OFFLINE
    //////////////////////////////////////////////////////

    async userOffline(userId) {

        try {

            await pool.query(

                `
                UPDATE users
                SET
                    is_online = FALSE,
                    last_seen = NOW()
                WHERE id = $1
                `,

                [userId],

            );

            this.broadcastPresence({

                userId,

                isOnline: false,

            });

        } catch (error) {

            console.error(error);

        }

    }

    //////////////////////////////////////////////////////
    // USER TYPING
    //////////////////////////////////////////////////////

    typing({

        senderId,

        receiverId,

    }) {

        const receivers =

            socketRegistry.getSockets(

                receiverId,

            );

        for (const socket of receivers) {

            socket.emit(

                "user-typing",

                {

                    senderId,

                },

            );

        }

    }

    //////////////////////////////////////////////////////
    // USER STOP TYPING
    //////////////////////////////////////////////////////

    stopTyping({

        senderId,

        receiverId,

    }) {

        const receivers =

            socketRegistry.getSockets(

                receiverId,

            );

        for (const socket of receivers) {

            socket.emit(

                "user-stop-typing",

                {

                    senderId,

                },

            );

        }

    }

    //////////////////////////////////////////////////////
    // USER RECORDING
    //////////////////////////////////////////////////////

    recording({

        senderId,

        receiverId,

    }) {

        const receivers =

            socketRegistry.getSockets(

                receiverId,

            );

        for (const socket of receivers) {

            socket.emit(

                "user-recording",

                {

                    senderId,

                },

            );

        }

    }

    //////////////////////////////////////////////////////
    // USER STOP RECORDING
    //////////////////////////////////////////////////////

    stopRecording({

        senderId,

        receiverId,

    }) {

        const receivers =

            socketRegistry.getSockets(

                receiverId,

            );

        for (const socket of receivers) {

            socket.emit(

                "user-stop-recording",

                {

                    senderId,

                },

            );

        }

    }

    //////////////////////////////////////////////////////
    // BROADCAST PRESENCE
    //////////////////////////////////////////////////////

    broadcastPresence({

        userId,

        isOnline,

    }) {

        const users =

            socketRegistry.allUsers();

        for (const finalUserId of users) {

            if (

                finalUserId === userId.toString()

            ) {

                continue;

            }

            const sockets =

                socketRegistry.getSockets(

                    finalUserId,

                );

            for (const socket of sockets) {

                socket.emit(

                    "presence-update",

                    {

                        userId,

                        isOnline,

                        lastSeen: new Date(),

                    },

                );

            }

        }

    }

    //////////////////////////////////////////////////////
    // LAST SEEN
    //////////////////////////////////////////////////////

    async updateLastSeen(userId) {

        try {

            await pool.query(

                `
                UPDATE users
                SET last_seen = NOW()
                WHERE id = $1
                `,

                [

                    userId,

                ],

            );

        } catch (error) {

            console.error(error);

        }

    }

    //////////////////////////////////////////////////////
    // IS USER ONLINE
    //////////////////////////////////////////////////////

    isOnline(userId) {

        return socketRegistry.has(

            userId,

        );

    }

    //////////////////////////////////////////////////////
    // ONLINE USERS COUNT
    //////////////////////////////////////////////////////

    onlineUsers() {

        return socketRegistry.onlineCount();

    }

}

module.exports = new PresenceService();