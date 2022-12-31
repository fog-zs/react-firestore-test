import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import Button from '@mui/material/Button';
import { encrypt } from "./Crypto";
import Cookies from "js-cookie";

const SignIn = (props:any) =>{
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const handleSignInPopup = ()=>{
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential === null) {return;}
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(token);
        // localStorage.setItem("user", JSON.stringify(user));  
        Cookies.set("token", encrypt(token));
        Cookies.set("user", encrypt(JSON.stringify(user)));
        props.setToken(token);
        props.setUser(user);
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
  }
    return <>
        <Button onClick={handleSignInPopup} variant="contained">Sign In with Google</Button>
    </>
}

export default SignIn;