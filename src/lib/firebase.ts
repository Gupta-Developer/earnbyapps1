
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "earnbyapps1",
  "appId": "1:210632480703:web:363ea6b403e5a74df8f30a",
  "storageBucket": "earnbyapps1.firebasestorage.app",
  "apiKey": "AIzaSyAZXA-wKGcHgwuPn1E3BHstphrTj2EZ02U",
  "authDomain": "earnbyapps1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "210632480703"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
