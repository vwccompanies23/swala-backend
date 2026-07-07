class SocketRegistry {

    constructor() {

        this.users = new Map();

    }

    //////////////////////////////////////////////////////
    // REGISTER
    //////////////////////////////////////////////////////

    register({ userId, socket }) {

        userId = String(userId);

        let devices = this.users.get(userId);

        if (!devices) {

            devices = new Map();

            this.users.set(userId, devices);

        }

        devices.set(socket.id, {

            socketId: socket.id,

            socket,

            connectedAt: new Date(),

            lastSeen: new Date(),

        });

        console.log(
            `🟢 User ${userId} connected (${devices.size} device(s))`
        );

    }

    //////////////////////////////////////////////////////
    // UNREGISTER
    //////////////////////////////////////////////////////

    unregister(userId, socketId) {

        userId = String(userId);

        const devices = this.users.get(userId);

        if (!devices) return;

        devices.delete(socketId);

        if (devices.size === 0) {

            this.users.delete(userId);

            console.log(`🔴 User ${userId} offline`);

        } else {

            console.log(
                `🟡 User ${userId} has ${devices.size} device(s) remaining`
            );

        }

    }

    //////////////////////////////////////////////////////
    // GET USER DEVICES
    //////////////////////////////////////////////////////

    get(userId) {

        return this.users.get(String(userId));

    }

    //////////////////////////////////////////////////////
    // GET FIRST SOCKET
    //////////////////////////////////////////////////////

    getSocket(userId) {

        const sockets = this.getSockets(userId);

        return sockets.length ? sockets[0] : null;

    }

    //////////////////////////////////////////////////////
    // GET ALL SOCKETS
    //////////////////////////////////////////////////////

    getSockets(userId) {

        const devices = this.users.get(String(userId));

        if (!devices) {

            return [];

        }

        return [...devices.values()].map(
            device => device.socket
        );

    }

    //////////////////////////////////////////////////////
    // USER ONLINE
    //////////////////////////////////////////////////////

    has(userId) {

        return this.users.has(String(userId));

    }

    //////////////////////////////////////////////////////
    // TOUCH
    //////////////////////////////////////////////////////

    touch(userId, socketId) {

        const devices = this.users.get(String(userId));

        if (!devices) return;

        const device = devices.get(socketId);

        if (!device) return;

        device.lastSeen = new Date();

    }

    //////////////////////////////////////////////////////
    // REMOVE SOCKET
    //////////////////////////////////////////////////////

    removeSocket(socketId) {

        for (const [userId, devices] of this.users.entries()) {

            if (devices.has(socketId)) {

                devices.delete(socketId);

                if (devices.size === 0) {

                    this.users.delete(userId);

                    console.log(`🔴 User ${userId} offline`);

                }

                break;

            }

        }

    }

    //////////////////////////////////////////////////////
    // ALL USERS
    //////////////////////////////////////////////////////

    allUsers() {

        return [...this.users.keys()];

    }

    //////////////////////////////////////////////////////
    // ONLINE DEVICES
    //////////////////////////////////////////////////////

    onlineCount() {

        let total = 0;

        for (const devices of this.users.values()) {

            total += devices.size;

        }

        return total;

    }

}

module.exports = new SocketRegistry();