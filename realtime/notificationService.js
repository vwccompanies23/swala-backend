const admin = require("firebase-admin");
const socketRegistry = require("./socketRegistry");

class NotificationService {

    //////////////////////////////////////////////////////
    // IN-APP NOTIFICATION
    //////////////////////////////////////////////////////

    sendToUser({

        userId,

        event,

        data,

    }) {

        const sockets =

            socketRegistry.getSockets(

                userId,

            );

        if (sockets.length === 0) {

            return false;

        }

        for (const socket of sockets) {

            socket.emit(

                event,

                data,

            );

        }

        return true;

    }

    //////////////////////////////////////////////////////
    // MULTIPLE USERS
    //////////////////////////////////////////////////////

    sendToUsers({

        userIds,

        event,

        data,

    }) {

        for (const userId of userIds) {

            this.sendToUser({

                userId,

                event,

                data,

            });

        }

    }

    //////////////////////////////////////////////////////
    // PUSH NOTIFICATION
    //////////////////////////////////////////////////////

    async sendPush({

        token,

        title,

        body,

        data = {},

    }) {

        if (!token) {

            return;

        }

        try {

            await admin.messaging().send({

                token,

                notification: {

                    title,

                    body,

                },

                data,

            });

        }

        catch (error) {

            console.error(

                "Push Notification Error:",

                error,

            );

        }

    }

    //////////////////////////////////////////////////////
    // MULTIPLE PUSH TOKENS
    //////////////////////////////////////////////////////

    async sendPushToMany({

        tokens,

        title,

        body,

        data = {},

    }) {

        if (

            !tokens ||

            tokens.length === 0

        ) {

            return;

        }

        await Promise.all(

            tokens.map(

                token =>

                    this.sendPush({

                        token,

                        title,

                        body,

                        data,

                    }),

            ),

        );

    }

    //////////////////////////////////////////////////////
    // CHAT MESSAGE
    //////////////////////////////////////////////////////

    async newMessage({

        receiverId,

        senderName,

        message,

        fcmToken,

    }) {

        this.sendToUser({

            userId: receiverId,

            event: "new-message",

            data: {

                senderName,

                message,

            },

        });

        await this.sendPush({

            token: fcmToken,

            title: senderName,

            body: message,

        });

    }

    //////////////////////////////////////////////////////
    // INCOMING CALL
    //////////////////////////////////////////////////////

    async incomingCall({

        receiverId,

        callerName,

        type,

        fcmToken,

    }) {

        this.sendToUser({

            userId: receiverId,

            event: "incoming-call",

            data: {

                callerName,

                type,

            },

        });

        await this.sendPush({

            token: fcmToken,

            title: "Incoming Call",

            body: `${callerName} is calling you`,

        });

    }

    //////////////////////////////////////////////////////
    // BROADCAST
    //////////////////////////////////////////////////////

    broadcast({

        event,

        data,

    }) {

        const users =

            socketRegistry.allUsers();

        for (const userId of users) {

            this.sendToUser({

                userId,

                event,

                data,

            });

        }

    }

    //////////////////////////////////////////////////////
    // BROADCAST EXCEPT ONE USER
    //////////////////////////////////////////////////////

    broadcastExcept({

        exceptUserId,

        event,

        data,

    }) {

        const users =

            socketRegistry.allUsers();

        for (const userId of users) {

            if (

                userId.toString() ===

                exceptUserId.toString()

            ) {

                continue;

            }

            this.sendToUser({

                userId,

                event,

                data,

            });

        }

    }

}

module.exports = new NotificationService();