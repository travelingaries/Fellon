import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { BrowserRouter, Switch } from "react-router-dom";
import firebase from "./config/config";
import * as firebaseui from "firebaseui";

// FirebaseUI config
var uiConfig = {
  signInSuccessUrl: "../index.html",
  signInFlow: "redirect",
  signInOptions: [
    //Leave the lines as is for the providers you want to offer your users
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback function
  // Terms of service url/callback
  tosUrl: "",
  // Privacy policy url/callback
  privacyPolicyUrl: function () {
    window.location.assign("");
  },
};
// Initialize the FirebaseUI Widget using Firebase
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded
ui.start("#firebaseui-auth-container", uiConfig);

function initApp() {
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        // User is signed in
        var displayName = user.displayName;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var photoUrl = user.photoUrl;
        var providerData = user.providerData;
        user.getIdToken().then(function (accessToken) {
          //	document.getElementById('sign-in-status').textContent = 'Signed in';
          //	document.getElementById('sign-in').textContent = 'Sign out';
          //	document.getElementById('account-details').textContent = JSON.stringify({
          //		displayName: displayName
          //	}
        });
      } else {
        // User is signed out
        //document.getElementById("sign-in-status").textContent = "Signed out";
        //document.getElementById("sign-in").textContent = "Sign in";
        //document.getElementById("account-details").textContent = "null";
      }
    },
    function (error) {
      console.log(error);
    }
  );
}
window.addEventListener("load", function () {
  initApp();
});

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <App />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
