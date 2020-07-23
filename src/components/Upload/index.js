import React, { Component } from "react";
import NavBar from "../NavBar";
import UploadTabTabBar from "../TabBar";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Checkbox, Radio, rgbToHex, TextField } from "@material-ui/core";
import Button from "../styledComponents/Button.js";
import * as yup from "yup";

import "./Upload.css";

import uploadImg from "../../images/icoUploadVideo.png";
import theme1Img from "../../images/theme1.jpg";
import theme2Img from "../../images/theme2.jpg";
import theme3Img from "../../images/theme3.jpg";
import theme4Img from "../../images/theme4.jpg";
import theme5Img from "../../images/theme5.jpg";
import theme6Img from "../../images/theme6.jpg";
import checkImg from "../../images/imgCheck.png";
import minusImgOff from "../../images/icoMinusOff.png";
import minusImgOn from "../../images/icoMinusOn.png";
import plusImgOn from "../../images/icoPlusOn.png";
import plusImgOff from "../../images/icoPlusOff.png";

import firebase from "../../config/config.js";

import { connect } from "react-redux";
import { getCurrentUserInfo } from "../../actions";

const firestore = firebase.firestore();
const storage = firebase.storage();

const validationSchema = yup.object({
  title: yup
    .string()
    .required("제목을 입력해주세요")
    .min(2)
    .max(12, "제목은 12자까지만 가능합니다."),
  gender: yup
    .string()
    .matches(/^[1-3]$/)
    .required(),
  theme: yup
    .string()
    .matches(/^[1-6]$/)
    .required(),
});

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 3,
      video: null,
      url: "",
      progress: 0,
      participantsNum: 2,
      currentUserDoc: null,
      user: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleVideoUpload = this.handleVideoUpload.bind(this);
    this.submitPostData = this.submitPostData.bind(this);
  }
  componentDidMount() {
    this.props.getCurrentUserInfo().then(() => {
      this.setState({ user: this.props.user }, () => {
        this.setState({
          currentUserDoc: firestore
            .collection("users")
            .doc(this.state.user.uid),
        });
      });
    });
  }
  handleChange(e) {
    if (e.target.files[0]) {
      const video = e.target.files[0];
      this.setState({ video });
    }
  }
  handleVideoUpload() {
    const { video } = this.state;
    console.log("video: ", video);
    const storageRef = storage.ref(`userPosts/${video.name}`);
    const uploadTask = storageRef.put(video);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      (error) => {
        // Error function
        console.error(
          "Error while uploading video to Firebase storage: ",
          error
        );
      },
      () => {
        // Complete function
        console.log("video upload completed");
        this.setState({ progress: 0 });
        storageRef.getDownloadURL().then((url) => {
          this.setState({ url }, () => {
            console.log("video url in storage: ", url);
          });
        });
      }
    );
  }
  submitPostData(data) {
    const video = {
      name: "asdf",
    };
    this.setState({ video });
    const { title } = data;
    const gender = parseInt(data.gender);
    const theme = parseInt(data.theme);
    const postData = {
      title,
      gender,
      theme,
      participantsNum: this.state.participantsNum,
    };
    console.log("post data: ", postData);
    console.log(this.state.video);

    return firestore
      .collection("posts")
      .doc(this.state.video.name + new Date().toString)
      .set(postData)
      .then(() => {
        console.log("post data saved");
      });
  }
  addPostDataToUserData() {}

  render() {
    console.log("rerendered with: ", this.state.participantsNum);
    return (
      <div className="regular-index">
        <NavBar currentTab={this.state.currentTab} />
        <div className="container" style={{ paddingTop: "20px" }}>
          <div>
            <input
              type="file"
              id="videoToUploadInput"
              onChange={this.handleChange}
              style={{
                display: "block",
                position: "fixed",
                top: "90px",
                visibility: "hidden",
              }}
              accept="video/*"
            ></input>
          </div>
          <div className="elementDiv">
            <div style={{ float: "left" }}>
              <h4 style={{ marginBottom: "0px" }}>동영상 업로드</h4>
              <p style={{ color: "rgb(180,180,180)", fontSize: "12px" }}>
                베타버전은 사진보관함에 있는 동영상 <br />
                파일만 업로드 기능만 제공합니다.
              </p>
            </div>
            <div
              className="uploadButtonDiv"
              onClick={() => {
                var videoToUploadInput = document.getElementById(
                  "videoToUploadInput"
                );
                videoToUploadInput.click();
              }}
            >
              <img style={{ width: "46px" }} src={uploadImg} />
            </div>
          </div>
          <Formik
            enableReinitialize
            initialValues={{
              title: "",
              gender: "0",
              theme: "0",
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true);
              console.log("submit: ", data);
              this.submitPostData(data);
              setSubmitting(false);
            }}
          >
            {({ values, errors, isSubmitting }) => (
              <Form>
                <pre>{JSON.stringify(values, null, 2)}</pre>
                <div className="elementDiv">
                  <div>
                    <h4>제목</h4>
                    <Field
                      type="text"
                      name="title"
                      as={TextField}
                      value={values.title}
                      required
                      placeholder="최대 12글자 (예: 치맥 벙개)"
                      className="textField"
                    />
                  </div>
                </div>
                <div className="hiddenDiv">
                  <Field
                    name="gender"
                    type="radio"
                    value="1"
                    as={Radio}
                    id="selectGenderMale"
                    className="hiddenField"
                  />
                  <label className="hiddenField">남성</label>
                  <Field
                    name="gender"
                    type="radio"
                    value="2"
                    as={Radio}
                    id="selectGenderFemale"
                    className="hiddenField"
                  />
                  <label className="hiddenField">여성</label>
                  <Field
                    name="gender"
                    type="radio"
                    value="3"
                    as={Radio}
                    id="selectGenderBoth"
                    className="hiddenField"
                  />
                  <label className="hiddenField">남녀혼성</label>
                </div>
                <div className="hiddenDiv">
                  <Field
                    name="theme"
                    type="radio"
                    value="1"
                    as={Radio}
                    id="selectTheme1"
                    className="hiddenField"
                  />
                  <Field
                    name="theme"
                    type="radio"
                    value="2"
                    as={Radio}
                    id="selectTheme2"
                    className="hiddenField"
                  />
                  <Field
                    name="theme"
                    type="radio"
                    value="3"
                    as={Radio}
                    id="selectTheme3"
                    className="hiddenField"
                  />
                  <Field
                    name="theme"
                    type="radio"
                    value="4"
                    as={Radio}
                    id="selectTheme4"
                    className="hiddenField"
                  />
                  <Field
                    name="theme"
                    type="radio"
                    value="5"
                    as={Radio}
                    id="selectTheme5"
                    className="hiddenField"
                  />
                  <Field
                    name="theme"
                    type="radio"
                    value="6"
                    as={Radio}
                    id="selectTheme6"
                    className="hiddenField"
                  />
                </div>

                <div className="nextSignUpButton">
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="consentSubmitButton"
                    style={{
                      display: "none",
                      backgroundColor:
                        Object.keys(errors).length === 0
                          ? "#f50057"
                          : "rgb(221,221,221)",
                    }}
                    id="uploadPostButton"
                    onClick={() => {
                      if (Object.keys(errors).length > 0) {
                        window.alert(
                          `다음 항목에 문제가 있습니다: ${
                            Object.keys(errors)[0]
                          }`
                        );
                      }
                    }}
                  >
                    →
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="elementDiv" id="selectNumAndGender">
            <div>
              <h4>인원·성별</h4>
              <div>
                <div className="genderSelectDiv">
                  <div
                    style={{ float: "left", paddingBottom: "4px" }}
                    onClick={() => {
                      console.log("run male");
                      var selectGenderMale = document.getElementById(
                        "selectGenderMale"
                      );
                      var selectGenderMaleCheckmark = document.getElementById(
                        "selectGenderMaleCheckmark"
                      );
                      var selectGenderFemaleCheckmark = document.getElementById(
                        "selectGenderFemaleCheckmark"
                      );
                      var selectGenderBothCheckmark = document.getElementById(
                        "selectGenderBothCheckmark"
                      );
                      var selectGenderMaleText = document.getElementById(
                        "selectGenderMaleText"
                      );
                      var selectGenderFemaleText = document.getElementById(
                        "selectGenderFemaleText"
                      );
                      var selectGenderBothText = document.getElementById(
                        "selectGenderBothText"
                      );

                      selectGenderMale.click();
                      selectGenderMaleCheckmark.style.display = "block";
                      selectGenderFemaleCheckmark.style.display = "none";
                      selectGenderBothCheckmark.style.display = "none";
                      selectGenderMaleText.style.color = "rgb(255,85,117)";
                      selectGenderFemaleText.style.color = "#363636";
                      selectGenderBothText.style.color = "#363636";
                    }}
                  >
                    <h6 id="selectGenderMaleText">남성</h6>
                  </div>
                  <div style={{ float: "right" }}>
                    <img
                      className="checkmark"
                      src={checkImg}
                      id="selectGenderMaleCheckmark"
                    />
                  </div>
                </div>
                <div className="genderSelectDiv">
                  <div
                    style={{ float: "left", paddingBottom: "4px" }}
                    onClick={() => {
                      console.log("run female");
                      var selectGenderFemale = document.getElementById(
                        "selectGenderFemale"
                      );
                      var selectGenderMaleCheckmark = document.getElementById(
                        "selectGenderMaleCheckmark"
                      );
                      var selectGenderFemaleCheckmark = document.getElementById(
                        "selectGenderFemaleCheckmark"
                      );
                      var selectGenderBothCheckmark = document.getElementById(
                        "selectGenderBothCheckmark"
                      );
                      var selectGenderMaleText = document.getElementById(
                        "selectGenderMaleText"
                      );
                      var selectGenderFemaleText = document.getElementById(
                        "selectGenderFemaleText"
                      );
                      var selectGenderBothText = document.getElementById(
                        "selectGenderBothText"
                      );

                      selectGenderFemale.click();
                      selectGenderMaleCheckmark.style.display = "none";
                      selectGenderFemaleCheckmark.style.display = "block";
                      selectGenderBothCheckmark.style.display = "none";
                      selectGenderMaleText.style.color = "#363636";
                      selectGenderFemaleText.style.color = "rgb(255,85,117)";
                      selectGenderBothText.style.color = "#363636";
                    }}
                  >
                    <h6 id="selectGenderFemaleText">여성</h6>
                  </div>
                  <div style={{ float: "right" }}>
                    <img
                      className="checkmark"
                      src={checkImg}
                      id="selectGenderFemaleCheckmark"
                    />
                  </div>
                </div>
                <div className="genderSelectDiv">
                  <div
                    style={{ float: "left", paddingBottom: "4px" }}
                    onClick={() => {
                      console.log("run both");
                      var selectGenderBoth = document.getElementById(
                        "selectGenderBoth"
                      );
                      var selectGenderMaleCheckmark = document.getElementById(
                        "selectGenderMaleCheckmark"
                      );
                      var selectGenderFemaleCheckmark = document.getElementById(
                        "selectGenderFemaleCheckmark"
                      );
                      var selectGenderBothCheckmark = document.getElementById(
                        "selectGenderBothCheckmark"
                      );
                      var selectGenderMaleText = document.getElementById(
                        "selectGenderMaleText"
                      );
                      var selectGenderFemaleText = document.getElementById(
                        "selectGenderFemaleText"
                      );
                      var selectGenderBothText = document.getElementById(
                        "selectGenderBothText"
                      );

                      selectGenderBoth.click();
                      selectGenderMaleCheckmark.style.display = "none";
                      selectGenderFemaleCheckmark.style.display = "none";
                      selectGenderBothCheckmark.style.display = "block";
                      selectGenderMaleText.style.color = "#363636";
                      selectGenderFemaleText.style.color = "#363636";
                      selectGenderBothText.style.color = "rgb(255,85,117)";
                    }}
                  >
                    <h6 id="selectGenderBothText">남녀혼성</h6>
                  </div>
                  <div style={{ float: "right" }}>
                    <img
                      className="checkmark"
                      src={checkImg}
                      id="selectGenderBothCheckmark"
                    />
                  </div>
                </div>
              </div>
              <div className="numSelectDiv">
                <div
                  onClick={() => {
                    if (this.state.participantsNum > 1) {
                      this.state.participantsNum--;
                      document.getElementById(
                        "participantsNumText"
                      ).innerHTML = `${this.state.participantsNum}명`;
                    }
                    if (this.state.participantsNum == 9) {
                      document.getElementById(
                        "plusParticipantsNum"
                      ).src = plusImgOn;
                    }
                    if (this.state.participantsNum <= 1) {
                      document.getElementById(
                        "minusParticipantsNum"
                      ).src = minusImgOff;
                    }
                  }}
                >
                  <button>
                    <img src={minusImgOn} id="minusParticipantsNum" />
                  </button>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginTop: "3px",
                      marginBottom: "0px",
                    }}
                    id="participantsNumText"
                  >
                    2명
                  </p>
                </div>
                <div
                  onClick={() => {
                    if (this.state.participantsNum < 10) {
                      this.state.participantsNum++;
                      document.getElementById(
                        "participantsNumText"
                      ).innerHTML = `${this.state.participantsNum}명`;
                    }
                    if (this.state.participantsNum == 2) {
                      document.getElementById(
                        "minusParticipantsNum"
                      ).src = minusImgOn;
                    }
                    if (this.state.participantsNum >= 10) {
                      document.getElementById(
                        "plusParticipantsNum"
                      ).src = plusImgOff;
                    }
                  }}
                >
                  <button>
                    <img id="plusParticipantsNum" src={plusImgOn} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="elementDiv" id="selectTheme">
            <div>
              <h4>테마</h4>
              <div className="themeRow">
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme1").click();
                  }}
                >
                  <img src={theme1Img} />
                </div>
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme2").click();
                  }}
                >
                  <img src={theme2Img} />
                </div>
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme3").click();
                  }}
                >
                  <img src={theme3Img} />
                </div>
              </div>
              <div className="themeRow">
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme4").click();
                  }}
                >
                  <img src={theme4Img} />
                </div>
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme5").click();
                  }}
                >
                  <img src={theme5Img} />
                </div>
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme6").click();
                  }}
                >
                  <img src={theme6Img} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer
          id="uploadTabTabBar"
          className="notReady"
          onClick={() => {
            document.getElementById("uploadPostButton").click();
          }}
        >
          <nav style={{ position: "relative" }}>
            <a href="#" style={{ textDecoration: "none" }}>
              <div className="submitUpload">업로드하기</div>
            </a>
          </nav>
        </footer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

export default connect(mapStateToProps, { getCurrentUserInfo })(Upload);
