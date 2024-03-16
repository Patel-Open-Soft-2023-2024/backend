import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from  '../firebase/firebaseConfig'
import { useNavigate } from "react-router-dom";


function GoogleSignIn(){
    const nav = useNavigate();
    const handleGoogle = async(e)=>{
        const provider = await new GoogleAuthProvider();
        console.log("login");
        signInWithPopup(auth, provider).then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            console.log(user);
            nav('/');
        }).catch((error) => {
            // Handle Errors here.
            // const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            // const email = error.customData.email;
            // The AuthCredential type that was used.
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log(errorMessage);
        })
      }
  
    return(
      <div>
        <button onClick={handleGoogle}>
          Sign in with google
        </button>
      </div>
    )
  }

export default GoogleSignIn;