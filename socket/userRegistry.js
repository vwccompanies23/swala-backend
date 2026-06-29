const users = new Map();

function registerUser(userId, socketId) {

  let sockets = users.get(userId);

  if (!sockets) {

    sockets = new Set();

    users.set(userId, sockets);

  }

  sockets.add(socketId);

}

function removeUser(socketId) {

  users.forEach((sockets, userId) => {

    sockets.delete(socketId);

    if (sockets.size === 0) {

      users.delete(userId);

    }

  });

}

function getSocket(userId) {

  const sockets = users.get(userId);

  if (!sockets || sockets.size === 0) {

    return null;

  }

  return [...sockets][0];

}

function getSockets(userId) {

  const sockets = users.get(userId);

  if (!sockets) {

    return [];

  }

  return [...sockets];

}

function isOnline(userId) {

  return users.has(userId);

}

function getUsers() {

  return users;

}

module.exports = {

  registerUser,

  removeUser,

  getSocket,

  getSockets,

  isOnline,

  getUsers,

};