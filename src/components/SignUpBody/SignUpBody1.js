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

import { connect } from "react-redux";

import { loginUser } from "../../actions";

firebase.auth().useDeviceLanguage();

const firestore = firebase.firestore();

class SignUpBody1 extends Component {
  state = { phoneNumber: "" };

  componentDidMount() {
    var uiConfig = {
      signInSuccessUrl: "/",
      signInFlow: "redirect",
      signInOptions: [
        {
          //Leave the lines as is for the providers you want to offer your users
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          // Change default country code
          defaultCountry: "KR",
        },
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

  handleSignUpSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    console.log(values);
    await this.props.signUp(values, this.props.history);
    actions.setSubmitting(false);
  };

  handlePhoneNumberSubmit(phoneNumber) {
    const { dispatch } = this.props;

    var appVerifier = window.recaptchaVerifier;

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the user in with confirmationResult.confirm(code)
        window.confirmationResult = confirmationResult;
      })
      .then(() => {
        // Check if user exists in database
        firestore
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              // Create new user document
              const userData = {
                phoneNumber,
              };
              return firestore
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set(userData)
                .then(() => {
                  console.log(
                    `new user ${firebase.auth().currentUser.uid} was created`
                  );
                  dispatch(loginUser(phoneNumber, appVerifier));
                });
            } else {
              console.log("User already exists in database");
              dispatch(loginUser(phoneNumber, appVerifier));
            }
          });
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
                    width: "1px",
                    opacity: "0.01",
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

function mapStateToProps(state) {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    loginError: state.auth.loginError,
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default connect(mapStateToProps)(SignUpBody1);
