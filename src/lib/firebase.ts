
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAN-WXqRkj1enP2ui1AZroPb0-T9sRCXDU",
  authDomain: "taskbucks-t58pq.firebaseapp.com",
  projectId: "taskbucks-t58pq",
  storageBucket: "taskbucks-t58pq.appspot.com",
  messagingSenderId: "489072793372",
  appId: "1:489072793372:web:f9bbcca321202a9f8c8cd9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
