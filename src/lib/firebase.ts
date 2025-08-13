
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD16zBhk9QMHX7BpbDHgaGbnOQ-zbWcGTM",
  authDomain: "earnbyapps-e43d5.firebaseapp.com",
  projectId: "earnbyapps-e43d5",
  storageBucket: "earnbyapps-e43d5.appspot.com",
  messagingSenderId: "622413944578",
  appId: "1:622413944578:web:1b63cb659348205871141b"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
