const admin = require("firebase-admin");

const serviceAccount = require("./swalaapp-firebase-adminsdk-fbsvc-6793b46e92.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;