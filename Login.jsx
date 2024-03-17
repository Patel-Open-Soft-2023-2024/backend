/**
 * src/Login.js
 */
import React from "react";
import { useHistory } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Login() {
  const history = useHistory();
  async function googleLogin() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        localStorage.setItem("@token", token);
        const user = result.user;
        console.log(token,user);
        //6 - navigate user to the book list
        history.push("/protected");
        // The signed-in user info.
        // IdP data available using getAdditionalUserInfo(result)
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(errorCode,errorMessage,email,credential);
    });
  }
  return (
    <div>
      <button onClick={googleLogin} className="login-button">
        GOOGLE
      </button>
    </div>
  );
}