import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { BrowserRouter, Switch } from "react-router-dom";
import firebase from "./config/config";

import configureStore from "./store/configureStore";

import { Provider, useSelector } from "react-redux";
import {
  reactReduxFirebase,
  getFirebase,
  isLoaded,
} from "react-redux-firebase";

import * as serviceWorker from "./serviceWorker";

// react-redux-firebase config
const rrfConfig = {
  useFirestoreForProfile: false,
  attachAuthIsReady: true,
};

const store = configureStore();

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

function AuthIsLoaded({ children }) {
  const auth = useSelector((state) => {
    console.log(state.firebase.auth);
    console.log(state);
    return state.firebase.auth;
  });
  if (!isLoaded(auth)) return <div>Loading...</div>;
  return children;
}
const renderApp = () =>
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById("root")
  );

if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept("./App", renderApp);
}
renderApp();

serviceWorker.unregister();
