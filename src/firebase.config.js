// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXPyJsF5DsSD87DyM2m89x8Fa-fwpAWZk",
  authDomain: "book-reviews-44c0b.firebaseapp.com",
  projectId: "book-reviews-44c0b",
  storageBucket: "book-reviews-44c0b.appspot.com",
  messagingSenderId: "793273034378",
  appId: "1:793273034378:web:1e394fce478a791c92af73",
  measurementId: "G-2W39K7SXXM"
};

// Initialize Firebase

initializeApp(firebaseConfig);

export const db = getFirestore()