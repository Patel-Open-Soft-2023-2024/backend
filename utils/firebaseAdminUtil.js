const admin = require("firebase-admin");
const serviceAccount = require("../opensoft-auth-firebase-adminsdk-awtz5-68f412634c.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = { admin };