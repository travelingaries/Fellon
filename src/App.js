import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route } from "react-router-dom";

import TabBar from "./components/TabBar";
import My from "./components/My";
import Upload from "./components/Upload";
import Notification from "./components/Notification";
import Start from "./components/start";
import SignUp from "./components/SignUp";
import Login from "./components/login";

import firebase from "./config/config.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      user: {},
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user });
        //  localStorage.setItem('user',user.uid);
      } else {
        this.setState({ user: null });
        //  localStorage.removeItem('user');
      }
    });
  }

  render() {
    return (
      <div>
        <div className="outermost" style={{ maxWidth: "800px" }}>
          {this.state.user ? (
            <Route path="/" exact component={My} />
          ) : (
            <Route path="/" exact component={Start} />
          )}
          {this.state.user ? (
            <Route path="/upload" exact component={Upload} />
          ) : null}
          {this.state.user ? (
            <Route path="/notification" exact component={Notification} />
          ) : null}
          {this.state.user ? (
            <Route path="/signUp" exact component={SignUp} />
          ) : (
            <Route path="/signUp" exact component={SignUp} />
          )}
          {this.state.user ? (
            <Route path="/" exact component={Login} />
          ) : (
            <Route path="/login" exact component={Login} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
