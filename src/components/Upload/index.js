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
const firestore = firebase.firestore();
const storage = firebase.storage();

const validationSchema = yup.object({
  title: yup
    .string()
    .required("제목을 입력해주세요")
    .min(2)
    .max(12, "제목은 12자까지만 가능합니다."),
  gender: yup.number().min(1).max(3).required(),
  theme: yup.string().min(1).max(6).required(),
});

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 3,
      video: null,
      url: "",
      progress: 0,
      currentUserDoc: null,
    };
  }
  componentDidMount() {
    this.setState({
      currentUserDoc: firestore
        .collection("users")
        .doc(firebase.auth().currentUser.uid),
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
    this.addPostDataToUserData();
  }
  addPostDataToUserData() {}

  render() {
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
            initialValues={{
              title: "",
              gender: "0",
              participatesNum: 2,
              theme: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true);
              console.log("submit: ", data);
              //this.submitPostData(data);
              setSubmitting(false);
            }}
          >
            {({ values, errors, isSubmitting }) => (
              <Form>
                <div className="elementDiv">
                  <div>
                    <h4>제목</h4>
                    <Field
                      type="text"
                      name="title"
                      as={TextField}
                      required
                      placeholder="최대 12글자 (예: 치맥 벙개)"
                      className="textField"
                    />
                  </div>
                </div>
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
                <Field
                  type="number"
                  name="participantsNum"
                  as={TextField}
                  required
                  className="textField hiddenField"
                  value={values.participatesNum}
                  id="participantsNum"
                />
                <div className="elementDiv" style={{ marginTop: "-60px" }}>
                  <div>
                    <h4>테마</h4>
                    <div className="themeRow">
                      <div
                        className="themeImgDiv"
                        onClick={() => {
                          document.getElementById("theme").value = "맛집";
                        }}
                      >
                        <img src={theme1Img} />
                      </div>
                      <div
                        className="themeImgDiv"
                        onClick={() => {
                          document.getElementById("theme").value = "벙개";
                        }}
                      >
                        <img src={theme2Img} />
                      </div>
                      <div
                        className="themeImgDiv"
                        onClick={() => {
                          document.getElementById("theme").value = "음악";
                        }}
                      >
                        <img src={theme3Img} />
                      </div>
                    </div>
                    <div className="themeRow">
                      <div
                        className="themeImgDiv"
                        onClick={() => {
                          document.getElementById("theme").value = "여행";
                        }}
                      >
                        <img src={theme4Img} />
                      </div>
                      <div
                        className="themeImgDiv"
                        onClick={() => {
                          document.getElementById("theme").value = "소모임";
                        }}
                      >
                        <img src={theme5Img} />
                      </div>
                      <div
                        className="themeImgDiv"
                        onClick={() => {
                          document.getElementById("theme").value = "운동";
                        }}
                      >
                        <img src={theme6Img} />
                      </div>
                    </div>
                  </div>
                </div>
                <Field
                  type="text"
                  name="theme"
                  as={TextField}
                  required
                  className="textField"
                  id="theme"
                  placeholder="테마 직접 입력 (최대 12글자)"
                />
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
                    var participantsNumField = document.getElementById(
                      "participantsNum"
                    );
                    if (
                      participantsNumField &&
                      participantsNumField.value > 2
                    ) {
                      participantsNumField.value--;
                      document.getElementById(
                        "participantsNumText"
                      ).innerHTML = `${participantsNumField.value}명`;
                    }
                    if (participantsNumField.value == 9) {
                      document.getElementById(
                        "plusParticipantsNum"
                      ).src = plusImgOn;
                    }
                    if (participantsNumField.value <= 2) {
                      document.getElementById(
                        "minusParticipantsNum"
                      ).src = minusImgOff;
                    }
                  }}
                >
                  <button>
                    <img src={minusImgOff} id="minusParticipantsNum" />
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
                    var participantsNumField = document.getElementById(
                      "participantsNum"
                    );
                    if (
                      participantsNumField &&
                      participantsNumField.value < 10
                    ) {
                      participantsNumField.value++;
                      document.getElementById(
                        "participantsNumText"
                      ).innerHTML = `${participantsNumField.value}명`;
                    }
                    if (participantsNumField.value == 3) {
                      document.getElementById(
                        "minusParticipantsNum"
                      ).src = minusImgOn;
                    }
                    if (participantsNumField.value >= 10) {
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

export default Upload;
