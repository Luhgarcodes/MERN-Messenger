import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCD9pELbrvM8cmSmcjRnYPZS0sQX8Xyw_g",
    authDomain: "messenger-mern-251bc.firebaseapp.com",
    projectId: "messenger-mern-251bc",
    storageBucket: "messenger-mern-251bc.appspot.com",
    messagingSenderId: "206129568801",
    appId: "1:206129568801:web:dbae4ecabc30cc12e65760"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebaseApp.firestore();
const provider = new GoogleAuthProvider();

export { auth, provider, db }