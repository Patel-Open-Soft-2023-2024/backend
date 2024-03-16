import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from  '../firebase/firebaseConfig'

import React, { useState } from 'react';

function EmailSignIn() {
  // State variables to hold email and password values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform signin logic here
        console.log('Email:', email);
        console.log('Password:', password);
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
        // You can send the data to your backend for authentication here
        // For example, you can make an API call to your server with the email and password data
    };
    
    const handleForgotPassword = (event)=>{
        event.preventDefault();
        sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            console.log("Password reset email sent!");
        })
    }
    return (
        <div>
        <h1>Sign in</h1>
        <form>
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
            <button onClick={handleSubmit}>Sign in</button>
            <button onClick={handleForgotPassword}>Forgot Password</button>
        </form>
        </div>
    );
}

export default EmailSignIn;
