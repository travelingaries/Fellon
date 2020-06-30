import React, { Component } from "react";

import SignUpNavBar from "../SignUpNavBar";
import SignUpBody from "../SignUpBody";

//import logoImg from "../../images/imgLogo.png";
import "./signup.css";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSignUp: 0,
    };
  }
  render() {
    return (
      <div>
        <SignUpNavBar currentSignUp={this.state.currentSignUp} />
        <SignUpBody currentSignUp={this.state.currentSignUp} />
      </div>
    );
  }
}

export default SignUp;
