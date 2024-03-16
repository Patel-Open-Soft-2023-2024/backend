import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from  '../firebase/firebaseConfig'


import React, { useState } from 'react';

function Register() {
    // State variables to hold email and password values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // console.log("ok");
    const handleSubmit =(event) => {
        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            console.log(error.code);
        });
    };

    return (
        <div>
        <h1>Signup</h1>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>
            <div>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>
            <button onClick={handleSubmit}>Signup</button>
        </form>
        </div>
  );
}

export default Register;
