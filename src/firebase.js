import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB06gBwn5TGuMxRvOaJqNP243Dx8s7Ypcw",
  authDomain: "isklutter-44ba8.firebaseapp.com",
  projectId: "isklutter-44ba8",
  storageBucket: "isklutter-44ba8.appspot.com",
  messagingSenderId: "143228769830",
  appId: "1:143228769830:web:11afc342107ba446f0f8e7",
  measurementId: "G-3Z2FB4TZS9"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
