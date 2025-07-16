const admin = require("firebase-admin");

// Replace with your Firebase Admin SDK service account key
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
