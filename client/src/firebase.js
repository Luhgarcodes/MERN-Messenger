
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCD9pELbrvM8cmSmcjRnYPZS0sQX8Xyw_g",
    authDomain: "messenger-mern-251bc.firebaseapp.com",
    projectId: "messenger-mern-251bc",
    storageBucket: "messenger-mern-251bc.appspot.com",
    messagingSenderId: "206129568801",
    appId: "1:206129568801:web:dbae4ecabc30cc12e65760"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

export { app, auth, provider };