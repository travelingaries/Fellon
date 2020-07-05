import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Button from "../styledComponents/Button.js";
import * as yup from "yup";
import { Checkbox, Radio, rgbToHex, TextField } from "@material-ui/core";
import validator from "validator";

import firebase from "../../config/config.js";
import "../SignUp/signup.css";
import * as firebaseui from "firebaseui";

firebase.auth().useDeviceLanguage();
/*
var uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.PhoneAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccess: () => false,
  },
};*/

//firebase.initializeApp({
//  apiKey: "AIzaSyBIcrrxo7p6NrLUw9__BCWahoOcL5DBaEU",
//  authDomain: "localhost",
//});

class SignUpBody1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: this.props.currentTab,
      isSignedIn: false,
    };
  }

  componentDidMount() {
    //firebase.auth().onAuthStateChanged((user) => {
    //  this.setState({ isSignedIn: !!user });
    //});
    // FirebaseUI config
    var uiConfig = {
      signInSuccessUrl: "/",
      signInFlow: "redirect",
      signInOptions: [
        //Leave the lines as is for the providers you want to offer your users
        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      ],
      // tosUrl and privacyPolicyUrl accept either url string or a callback function
      // Terms of service url/callback
      tosUrl: "",
      // Privacy policy url/callback
      privacyPolicyUrl: function () {
        window.location.assign("");
      },
    };
    // Initialize the FirebaseUI Widget using Firebase
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded
    ui.start("#firebaseui-auth-container", uiConfig);

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "phoneNumberSubmitButton",
      {
        size: "invisible",
        callback: function (response) {
          //reCAPTCHA solved, allow signInWithPhoneNumber
          console.log("recaptcha solved");
        },
      }
    );
  }

  validatePhoneNumber = (number) => {
    const isValidPhoneNumber = validator.isMobilePhone(number);
    return isValidPhoneNumber;
  };

  handlePhoneNumberSubmit(phoneNumber) {
    var appVerifier = window.recaptchaVerifier;
    console.log("got here yeah");
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the user in with confirmationResult.confirm(code)
        window.confirmationResult = confirmationResult;
      })
      .catch(function (error) {
        // Error; SMS not sent
        console.log("error: ", error);
        //grecap;
      });
  }

  render() {
    return (
      <div className="startContainer">
        {this.state.isSignedIn ? <h3>Signed In!</h3> : <h3>NotSignedIn</h3>}
        <div id="firebaseui-auth-container"></div>
        <Formik
          initialValues={{
            phoneNumber: "",
          }}
          onSubmit={(data, { setSubmitting }) => {
            setSubmitting(true);
            console.log("submit: ", data);
            setSubmitting(false);
          }}
        >
          {({ values, errors, isSubmitting }) => (
            <Form>
              <div>
                <Field
                  type="text"
                  name="phoneNumber"
                  as={TextField}
                  style={{ width: "100%" }}
                  required
                  placeholder="휴대폰 번호 입력"
                />
                <p style={{ color: "rgb(153,153,153)" }}>
                  가입하면 이용 약관에 동의하며 개인정보 보호정책을 읽고
                  이해했음을 확인하는 것입니다. 회원님의 전화번호를 확인하기
                  위해 문자가 전송되며 문자 요금이 부과될 수 있습니다.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  paddingTop: "10px",
                }}
              >
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="phoneNumberSubmitButton g-recaptcha"
                  id="phoneNumberSubmitButton"
                  style={{
                    border: "1px solid rgb(221,221,221)",
                    backgroundColor:
                      this.validatePhoneNumber(values.phoneNumber) &&
                      (values.phoneNumber.length === 11 ||
                        values.phoneNumber.length === 10)
                        ? "rgb(255,85,117)"
                        : "white",
                  }}
                  // localhost key
                  data-sitekey="6LdGxqoZAAAAANbMNJ9l8RI3khTNHGuGtz_JCTKa"
                  // fellon firebase hosting key
                  //data-sitekey="6LclyqoZAAAAAIej5OJN4Stv5-5eA7mH94oG8bMl"
                  onClick={() =>
                    this.handlePhoneNumberSubmit(values.phoneNumber)
                  }
                  data-callback={() =>
                    this.handlePhoneNumberSubmit(values.phoneNumber)
                  }
                >
                  인증번호 요청하기
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
export default SignUpBody1;
