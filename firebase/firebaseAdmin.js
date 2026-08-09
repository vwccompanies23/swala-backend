const admin = require("firebase-admin");

const serviceAccount = require('./swalaapp-firebase-adminsdk-fbsvc-1f9004b198.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;