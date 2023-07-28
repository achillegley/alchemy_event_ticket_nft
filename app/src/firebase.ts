// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzDqDDLT9QX51h0zIzlVe6ooNc2c8I1-U",
  authDomain: "eventticketnft.firebaseapp.com",
  databaseURL: "https://eventticketnft-default-rtdb.firebaseio.com",
  projectId: "eventticketnft",
  storageBucket: "eventticketnft.appspot.com",
  messagingSenderId: "422518970048",
  appId: "1:422518970048:web:d4955707cc33becf3e3f25",
  measurementId: "G-4K1BV2N466"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db= firebase.database();