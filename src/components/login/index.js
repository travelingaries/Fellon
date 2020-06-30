import React, { Component } from "react";
import LoginNavBar from "../SignUpNavBar/LoginNavBar.js";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Button from "../styledComponents/Button.js";
import { Checkbox, Radio, rgbToHex, TextField } from "@material-ui/core";
import * as yup from "yup";
import validator from "validator";

import firebase from "../../config/config.js";

class Login extends Component {
  constructor(props) {
    super(props);
  }

  validatePhoneNumber = (number) => {
    const isValidPhoneNumber = validator.isMobilePhone(number);
    return isValidPhoneNumber;
  };

  render() {
    return (
      <div>
        <LoginNavBar />
        <div className="startContainer">
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
                    className="phoneNumberSubmitButton"
                    style={{
                      border: "1px solid rgb(221,221,221)",
                      backgroundColor:
                        this.validatePhoneNumber(values.phoneNumber) &&
                        (values.phoneNumber.length === 11 ||
                          values.phoneNumber.length === 10)
                          ? "rgb(255,85,117)"
                          : "white",
                    }}
                    onClick={() => {
                      this.props.handleChangeSignUpStage(1, true);
                      firebase.auth().signOut();
                    }}
                  >
                    인증번호 요청하기
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default Login;
