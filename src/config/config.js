import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import * as firebaseui from "firebaseui";

const firebaseConfig = {
  apiKey: "AIzaSyBIcrrxo7p6NrLUw9__BCWahoOcL5DBaEU",
  authDomain: "fellon-46901.firebaseapp.com",
  databaseURL: "https://fellon-46901.firebaseio.com",
  projectId: "fellon-46901",
  storageBucket: "fellon-46901.appspot.com",
  messagingSenderId: "773485413271",
  appId: "1:773485413271:web:380143181a2e7278397ad2",
  measurementId: "G-MP7V7N3QDJ",
};

// Initialize firebase instance
firebase.initializeApp(firebaseConfig);

// Initialize firestore
firebase.firestore();

export default firebase;
