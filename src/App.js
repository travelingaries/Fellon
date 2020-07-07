import React, { Component } from "react";
import "./App.css";
import { Route, Redirect, Switch } from "react-router-dom";

import Home from "./components/Home";
import My from "./components/My";
import Upload from "./components/Upload";
import Notification from "./components/Notification";
import Start from "./components/start";
import SignUp from "./components/SignUp";
//import Login from "./components/login";

import firebase from "./config/config.js";

import { connect } from "react-redux";

import ProtectedRoute from "./components/ProtectedRoute";

class App extends Component {
  /*
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: {},
    };
  }*/
  componentDidMount() {
    //    this.authListener();
  }
  /*
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
  }*/

  render() {
    const { isAuthenticated, isVerifying } = this.props;
    console.log("logging state: ", isAuthenticated);
    return (
      <div>
        <div className="outermost" style={{ maxWidth: "480px" }}>
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              component={Home}
              isAuthenticated={isAuthenticated}
              isVerifying={isVerifying}
            />
            <Route path="/start" component={Start} />
          </Switch>
          <Switch>
            <ProtectedRoute
              exact
              path="/profile"
              component={My}
              isAuthenticated={isAuthenticated}
              isVerifying={isVerifying}
            />
            <Route path="/start" component={Start} />
          </Switch>
          <Switch>
            <Route path="/signup" component={SignUp} />
          </Switch>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
  };
}

export default connect(mapStateToProps)(App);
