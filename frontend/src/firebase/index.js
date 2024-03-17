import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6q3FWjH1lu3spWGi_zPHU63tbHZp9OYA",
  authDomain: "opensoft-auth.firebaseapp.com",
  projectId: "opensoft-auth",
  storageBucket: "opensoft-auth.appspot.com",
  messagingSenderId: "221820489117",
  appId: "1:221820489117:web:c8f1ad43d16268d5ca3374",
  measurementId: "G-RZNCLYCS3K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;