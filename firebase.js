// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1qsF_UeiQzedrHKQ0N1RWZxgfeOtcP0k",
  authDomain: "next-uber-17.firebaseapp.com",
  projectId: "next-uber-17",
  storageBucket: "next-uber-17.appspot.com",
  messagingSenderId: "312073989744",
  appId: "1:312073989744:web:bf9d23fc3e8ed511c84eb5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();
export { app, provider, auth };
