import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Button from "../styledComponents/Button.js";
import { Checkbox, Radio, rgbToHex } from "@material-ui/core";
import * as yup from "yup";

import "../SignUp/signup.css";

import signupImg from "../../images/imgSignup.png";
import checkImg from "../../images/icoCheck.png";

const validationSchema = yup.object({
  //  lastName: yup.string().required().max(10),
  consent1: yup.boolean().required().oneOf([true]),
  consent2: yup.boolean().required().oneOf([true]),
});

class SignUpBody0 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: this.props.currentTab,
    };
  }

  render() {
    return (
      <div className="startContainer">
        <img src={signupImg} />
        <h2>
          약관 동의 및<br />
          인증 필요
        </h2>
        <p>
          서비스 이용 및 동영상 업로드를 하려면
          <br />
          약관 동의와 본인 인증이 필요합니다.
        </p>
        <Formik
          initialValues={{
            consent1: false,
            consent2: false,
            geoConsent: false,
          }}
          validationSchema={validationSchema}
          onSubmit={(data, { setSubmitting }) => {
            setSubmitting(true);
            console.log("submit: ", data);
            setSubmitting(false);
          }}
        >
          {({ values, errors, isSubmitting }) => (
            <Form>
              <div>
                <Field type="checkbox" name="consent1" as={Checkbox} required />
                <h4
                  className="summaries"
                  style={{ display: "inline", marginLeft: "3px" }}
                >
                  {" "}
                  [필수] 서비스 이용 약관 동의
                </h4>
              </div>
              <div>
                <Field type="checkbox" name="consent2" as={Checkbox} required />
                <h4
                  className="summaries"
                  style={{ display: "inline", marginLeft: "3px" }}
                >
                  {" "}
                  [필수] 개인정보 수집 및 이용 동의
                </h4>
              </div>
              <div>
                <Field type="checkbox" name="geoConsent" as={Checkbox} />
                <h4
                  className="summaries"
                  style={{ display: "inline", marginLeft: "3px" }}
                >
                  {" "}
                  [선택] 위치 정보 수집 및 이용 동의
                </h4>
              </div>

              <div className="nextSignUpButton">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="consentSubmitButton"
                  style={{
                    backgroundColor:
                      Object.keys(errors).length === 0 &&
                      values.consent1 &&
                      values.consent2
                        ? "#f50057"
                        : "rgb(221,221,221)",
                  }}
                  onClick={() => this.props.handleChangeSignUpStage(1, true)}
                >
                  →
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
//<pre>{JSON.stringify(values, null, 2)}</pre>
//<pre>{JSON.stringify(errors, null, 2)}</pre>
export default SignUpBody0;
