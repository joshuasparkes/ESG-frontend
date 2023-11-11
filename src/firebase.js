import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Your existing Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDUR3kclGFap4GQcTvNfoS56LWbx93azbg",
  authDomain: "esg-project-5893f.firebaseapp.com",
  projectId: "esg-project-5893f",
  storageBucket: "esg-project-5893f.appspot.com",
  messagingSenderId: "442589449605",
  appId: "1:442589449605:web:2c79d2cf1b543339b388ec",
  measurementId: "G-BY9QPK9791",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();

export { db, auth, provider, createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, signOut };
