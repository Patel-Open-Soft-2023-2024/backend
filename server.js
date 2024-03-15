import { initializeApp } from 'firebase/app';
import express from 'express';

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

const app = express();
app.use(express.json());
const firebase = initializeApp(firebaseConfig);
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

app.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            res.json(user);
            console.log("user created");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.json(errorCode, errorMessage);
            console.log(errorMessage);
        });
})

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            res.json(user);
            console.log("logged in");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.json(errorCode, errorMessage);
            console.log(errorMessage);
        });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})