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
        <div className="outermost" style={{ maxWidth: "800px" }}>
          {this.state.user ? (
            <Route path="/" exact component={Home} />
          ) : (
            <Route path="/" exact component={Start} />
          )}
          {this.state.user ? (
            <Route path="/search" exact component={Home} />
          ) : null}
          {this.state.user ? (
            <Route path="/upload" exact component={Upload} />
          ) : null}
          {this.state.user ? (
            <Route path="/notification" exact component={Notification} />
          ) : null}
          {this.state.user ? (
            <Route path="/profile" exact component={My} />
          ) : null}
          {this.state.user ? (
            <Route path="/signup" render={() => <Redirect to="/" />} />
          ) : (
            <Route path="/signup" exact component={SignUp} />
          )}
          {this.state.user ? (
            <Route path="/login" render={() => <Redirect to="/" />} />
          ) : (
            <Route path="/login" exact component={Login} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
