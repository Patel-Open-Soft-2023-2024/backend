import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
export const auth = getAuth(app);
export default app;