import React, { Component } from "react";
import TabBar from "../TabBar";
import NavBar from "../NavBar";
import HomeBody from "./HomeBody";

import firebase from "../../config/config.js";
firebase.auth().useDeviceLanguage();
const firestore = firebase.firestore();

class Home extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 1,
    };
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
      <div className="regular-index">
        <NavBar currentTab={this.state.currentTab} />
        <HomeBody />
        <TabBar currentTab={this.state.currentTab} />
      </div>
    );
  }
}

export default Home;
