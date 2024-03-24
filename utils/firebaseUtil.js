// const admin = require("firebase-admin");
// const serviceAccount = require("../opensoft-auth-firebase-adminsdk-awtz5-68f412634c.json");

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// module.exports = { admin };


const { initializeApp } =  require('firebase/app');
const { getAuth } = require('firebase/auth');

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZMl2mOlfX-MDvc9YlOBQKXDvRbigVELo",
    authDomain: "gc-open-soft.firebaseapp.com",
    projectId: "gc-open-soft",
    storageBucket: "gc-open-soft.appspot.com",
    messagingSenderId: "104527082012",
    appId: "1:104527082012:web:a1e3a00313b8b7d1fa65d9",
    measurementId: "G-8TTEM195L9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
module.exports = { app , auth };