const express = require('express');
const admin = require('firebase-admin');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


// Initialize Firebase Admin SDK
const serviceAccount = require('./opensoft-auth-firebase-adminsdk-awtz5-68f412634c.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware for Authentication
const authenticate = (req, res, next) => {

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((userData) => { 
      console.log("Logged in:", userData.email); next(); 
    } )

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const idToken = authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    }) 
    .catch(() => {
      return res.status(401).json({ error: 'Unauthorized' });
    });
};

// Protected Route
app.get('/protected', authenticate, (req, res) => {
  // Only authenticated users can access this route
  res.status(200).json({ message: 'Welcome to the protected route!' });
});

// // Dummy Registration Route
// app.post('/register', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }
//   try {
//     const userRecord = await admin.auth().createUser({
//       email,
//       password
//     });
//     res.status(200).json({ message: 'Registration successful', uid: userRecord.uid });
//   } catch (error) {
//     res.status(500).json({ error: 'Registration failed', message: error.message });
//   }
// });



// const jwt = require('jsonwebtoken');

// // Dummy Login Route
// app.post('/login', async (req, res) => {
//     user = await admin.auth().getUserByEmail(req.body.email)
//     admin.
//     console.log(user)
//     return res.status(200).json({ message: 'Login successful', uid: user.uid });
// });




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// MKkTtoeApfRhqAvdlIEdWdCyHEj1