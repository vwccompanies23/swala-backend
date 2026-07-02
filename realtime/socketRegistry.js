class SocketRegistry {

    constructor() {

        this.users = new Map();

    }

    register({

        userId,

        socket,

    }) {

        userId = userId.toString();

        let devices = this.users.get(userId);

        if (!devices) {

            devices = new Map();

            this.users.set(

                userId,

                devices,

            );

        }

        devices.set(

            socket.id,

            {

                socketId: socket.id,

                socket,

                connectedAt: new Date(),

                lastSeen: new Date(),

            },

        );

    }

    unregister(userId, socketId) {

        userId = userId.toString();

        const devices =

            this.users.get(userId);

        if (!devices) return;

        devices.delete(socketId);

        if (devices.size === 0) {

            this.users.delete(userId);

        }

    }

    get(userId) {

        userId = userId.toString();

        return this.users.get(userId);

    }

    getSocket(userId) {

        userId = userId.toString();

        const devices =

            this.users.get(userId);

        if (!devices) {

            return null;

        }

        return [...devices.values()][0]?.socket;

    }

    getSockets(userId) {

        userId = userId.toString();

        const devices =

            this.users.get(userId);

        if (!devices) {

            return [];

        }

        return [...devices.values()]

            .map(

                device => device.socket,

            );

    }

    has(userId) {

        return this.users.has(

            userId.toString(),

        );

    }

    touch(userId, socketId) {

        const devices =

            this.users.get(

                userId.toString(),

            );

        if (!devices) return;

        const device =

            devices.get(socketId);

        if (!device) return;

        device.lastSeen = new Date();

    }

    allUsers() {

        return [...this.users.keys()];

    }

    onlineCount() {

        let count = 0;

        this.users.forEach(

            devices => {

                count += devices.size;

            },

        );

        return count;

    }

}

module.exports = new SocketRegistry();