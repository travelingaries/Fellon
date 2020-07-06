import React, { Component } from "react";
import "./App.css";
import { Route, Redirect } from "react-router-dom";

import Home from "./components/Home";
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
        <div className="outermost" style={{ maxWidth: "480px" }}>
          {this.state.user ? (
            <Route path="/" exact component={Home} />
          ) : (
            <Route path="/" exact component={Start} />
          )}
          {this.state.user ? (
            <Route path="/search" exact component={Home} />
          ) : (
            <Route path="/search" render={() => <Redirect to="/" />} />
          )}
          {this.state.user ? (
            <Route path="/upload" exact component={Upload} />
          ) : (
            <Route path="/upload" render={() => <Redirect to="/" />} />
          )}
          {this.state.user ? (
            <Route path="/notification" exact component={Notification} />
          ) : (
            <Route path="/notification" render={() => <Redirect to="/" />} />
          )}
          {this.state.user ? (
            <Route path="/profile" exact component={My} />
          ) : (
            <Route path="/profile" render={() => <Redirect to="/" />} />
          )}
          {this.state.user ? null : (
            <Route path="/signup" exact component={SignUp} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
