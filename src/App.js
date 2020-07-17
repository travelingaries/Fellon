import React, { Component } from "react";
import "./App.css";
import { Route, Redirect, Switch } from "react-router-dom";

import Home from "./components/Home";
import My from "./components/My";
import Upload from "./components/Upload";
import Notification from "./components/Notification";
import Start from "./components/start";
import SignUp from "./components/SignUp";
import Login from "./components/login";

import firebase from "./config/config.js";

import { connect } from "react-redux";

import ProtectedRoute from "./components/ProtectedRoute";

class App extends Component {
  componentDidMount() {}

  render() {
    const { isAuthenticated, isVerifying } = this.props;
    console.log("logging state: ", isAuthenticated);
    return (
      <div>
        <div
          className="outermostContainer"
          style={{
            width: "100%",
            textAlign: "center",
            backgroundContainer: "rgb(221,221,221)",
          }}
        >
          <div
            className="outermost"
            style={{
              maxWidth: "480px",
              display: "inline-block",
              margin: "0 auto",
              textAlign: "left",
              display: "flex",
              justifyContent: "center",
              backgroundColor: "white",
              height: "99vh",
              border: "1px solid #e0e0e0",
            }}
          >
            <Switch>
              <Route path="/start" component={Start} />
              <ProtectedRoute
                exact
                path="/"
                component={Home}
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
              />
              <ProtectedRoute
                exact
                path="/profile"
                component={My}
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
              />
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
            </Switch>
          </div>
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
