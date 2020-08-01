import React, { Component } from "react";

import "./middlePage.css";

import firebase from "../../config/config.js";
firebase.auth().useDeviceLanguage();
const firestore = firebase.firestore();

class MiddlePage extends Component {
  constructor() {
    super();
    this.state = {};
  }
  createNewUserData(callback) {
    firestore
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          // Create new user document
          const userData = {
            phoneNumber: firebase.auth().currentUser.phoneNumber,
          };
          return firestore
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set(userData)
            .then(() => {
              console.log(
                `new user ${firebase.auth().currentUser.uid} was created`
              );
              callback();
            });
        } else callback();
      });
  }
  moveToEditProfile() {
    firestore
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        try {
          if (doc.data().username) {
            console.log("logged in success");
            window.location.href = "/";
          } else {
            console.log("user has no username data");
            window.location.href = "/editProfile";
          }
        } catch (err) {
          console.error(err);
        }
      });
  }

  render() {
    this.createNewUserData(() => {
      this.moveToEditProfile();
    });
    return (
      <div className="spinnerContainer">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}
export default MiddlePage;
