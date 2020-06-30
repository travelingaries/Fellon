import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import SignUpNavBar0 from "./SignUpNavBar0.js";
//import UploadTabNavBar from './UploadTabNavBar'
//import NotificationTabNavBar from './NotificationTabNavBar'

import "./signupnavbar.css";

class SignUpNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSignUp: this.props.currentSignUp,
    };
  }
  render() {
    if (this.state.currentSignUp == 0) {
      return <SignUpNavBar0 />;
    }
    //else if(this.state.currentTab==2) { return <UploadTabNavBar /> }
    //else if(this.state.currentTab==3) { return <NotificationTabNavBar /> }
  }
}

export default SignUpNavBar;
