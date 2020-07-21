import React, { Component } from "react";

import SignUpBody0 from "./SignUpBody0.js";
import SignUpBody1 from "./SignUpBody1.js";

//import logoImg from "../../images/imgLogo.png";
import "../SignUp/signup.css";

class SignUpBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSignUp: 0,
      geoConsent: false,
    };
    this.handleChangeSignUpStage = this.handleChangeSignUpStage.bind(this);
  }
  componentDidMount() {}
  handleChangeSignUpStage(moveTo, geoConsent) {
    this.setState({ currentSignUp: moveTo, geoConsent: true });
  }
  render() {
    if (this.state.currentSignUp === 0) {
      return (
        <SignUpBody0
          currentSignUp={this.state.currentSignUp}
          handleChangeSignUpStage={this.handleChangeSignUpStage}
        />
      );
    } else if (this.state.currentSignUp === 1) {
      return <SignUpBody1 currentSignUp={this.state.currentSignUp} />;
    }
  }
}

export default SignUpBody;
