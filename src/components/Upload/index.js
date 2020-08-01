import React, { Component } from "react";
import NavBar from "../NavBar";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Radio, TextField } from "@material-ui/core";
import * as yup from "yup";

import "./Upload.css";

import uploadImg from "../../images/icoUploadVideo.png";
import uploadedImg from "../../images/icoUploadVideoCheck.png";
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
    .matches(/^[0-6]$/)
    .required(),
});

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 3,
      media: null,
      url: "",
      progress: 0,
      participantsNum: 2,
      currentUserDoc: null,
      user: {},
      theme: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleMediaUpload = this.handleMediaUpload.bind(this);
    this.submitPostData = this.submitPostData.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
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
      const media = e.target.files[0];
      this.setState({ media });
      this.setState({ url: e.target.files[0].name });
    }
  }
  handleStateChange(type, e) {
    this.setState({ [type]: e.target.value }, () => {});
  }
  handleMediaUpload() {
    const { media } = this.state;
    console.log("media: ", this.state.media);
    const storageRef = storage.ref(`userPosts/${this.state.media.name}`);
    const uploadTask = storageRef.put(this.state.media);
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
          "Error while uploading media to Firebase storage: ",
          error
        );
      },
      () => {
        // Complete function
        console.log("media upload completed");
        this.setState({ progress: 0 });
        storageRef.getDownloadURL().then((url) => {
          this.setState({ url }, () => {
            console.log("media url in storage: ", url);
          });
        });
      }
    );
  }
  submitPostData(data) {
    // handle media upload
    const { media } = this.state;
    console.log("media: ", this.state.media);
    const storageRef = storage.ref(`userPosts/${this.state.media.name}`);
    const uploadTask = storageRef.put(this.state.media);
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
          "Error while uploading media to Firebase storage: ",
          error
        );
      },
      () => {
        // Complete function
        console.log("media upload completed");
        this.setState({ progress: 0 });
        storageRef.getDownloadURL().then((url) => {
          this.setState({ url }, () => {
            console.log("media url in storage: ", url);

            storageRef.getMetadata().then((metadata) => {
              const { title } = data;
              const gender = parseInt(data.gender);
              const theme = this.state.theme;
              const createdAt = new Date().toISOString();

              const conciseUserData = {
                uid: this.state.user.uid,
              };
              const mediaData = {
                name: this.state.media.name,
                url,
                contentType: metadata.contentType,
              };
              const postData = {
                title,
                gender,
                theme,
                participantsNum: this.state.participantsNum,
                media: mediaData,
                user: conciseUserData,
                createdAt,
              };
              console.log("posting data: ", postData);
              firestore
                .collection("posts")
                .doc(`${createdAt + " " + this.state.media.name}`)
                .set(postData)
                .then(() => {
                  console.log("post data saved");
                  const concisePostData = {
                    gender: postData.gender,
                    participantsNum: postData.participantsNum,
                    theme: postData.theme,
                    title: postData.title,
                    media: mediaData,
                    createdAt,
                  };

                  // Add post data to user document
                  /*this.state.currentUserDoc.get().then((doc) => {
                    const prevPosts = doc.data().posts;
                    return this.state.currentUserDoc
                      .update({
                        posts: [...prevPosts, concisePostData],
                      })
                      .then(() => {
                        console.log("added post data to user data");
                        window.location.href = "/";
                      });
                  });*/
                });
            });
          });
        });
      }
    );
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
              id="mediaToUploadInput"
              onChange={this.handleChange}
              style={{
                display: "block",
                position: "fixed",
                top: "90px",
                visibility: "hidden",
              }}
              accept="video/*,image/*"
            ></input>
          </div>
          <div className="elementDiv">
            <div style={{ float: "left" }}>
              <h4 style={{ marginBottom: "0px" }}>
                자기 소개 사진 / 동영상 업로드
              </h4>
              <p style={{ color: "rgb(180,180,180)", fontSize: "12px" }}>
                베타버전은 사진 보관함에 있는 <br />
                미디어 파일만 업로드 가능합니다.
              </p>
            </div>
            <div
              className="uploadButtonDiv"
              onClick={() => {
                var mediaToUploadInput = document.getElementById(
                  "mediaToUploadInput"
                );
                mediaToUploadInput.click();
              }}
            >
              <img
                style={{ width: "46px" }}
                src={this.state.url === "" ? uploadImg : uploadedImg}
              />
            </div>
            <div>
              <progress
                value={this.state.progress}
                max="100"
                style={{
                  width: "100%",
                  visibility:
                    this.state.progress === 0 || this.state.progress === 100
                      ? "hidden"
                      : "visible",
                }}
              />
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
                    onChange={(e) => this.handleStateChange("theme", e)}
                  />
                  <Field
                    name="theme"
                    type="radio"
                    value="2"
                    as={Radio}
                    id="selectTheme2"
                    className="hiddenField"
                    onChange={(e) => this.handleStateChange("theme", e)}
                  />
                  <Field
                    name="theme"
                    type="radio"
                    value="3"
                    as={Radio}
                    id="selectTheme3"
                    className="hiddenField"
                    onChange={(e) => this.handleStateChange("theme", e)}
                  />
                  <Field
                    name="theme"
                    type="radio"
                    value="4"
                    as={Radio}
                    id="selectTheme4"
                    className="hiddenField"
                    onChange={(e) => this.handleStateChange("theme", e)}
                  />
                  <Field
                    name="theme"
                    type="radio"
                    value="5"
                    as={Radio}
                    id="selectTheme5"
                    className="hiddenField"
                    onChange={(e) => this.handleStateChange("theme", e)}
                  />
                  <Field
                    name="theme"
                    type="radio"
                    value="6"
                    as={Radio}
                    id="selectTheme6"
                    className="hiddenField"
                    onChange={(e) => this.handleStateChange("theme", e)}
                  />
                </div>

                <div
                  className="nextSignUpButton"
                  style={{ width: "100%", margin: 0 }}
                >
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="consentSubmitButton"
                    id="hiddenSubmitButton"
                    ref={this.hiddenSubmitButton}
                    style={{
                      width: "100%",
                      backgroundColor:
                        Object.keys(errors).length === 0 &&
                        this.state.media &&
                        this.state.url !== "" &&
                        values.title !== "" &&
                        this.state.theme !== "0"
                          ? "#f50057"
                          : "rgb(221,221,221)",
                      borderRadius: "5px",
                      position: "fixed",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      maxWidth: "460px",
                      height: "40px",
                      margin: "0 auto",
                    }}
                    id="uploadPostButton"
                    onClick={() => {
                      if (Object.keys(errors).length > 0) {
                        window.alert(
                          `다음 항목에 문제가 있습니다: ${
                            Object.keys(errors)[0]
                          }`
                        );
                      } else if (this.state.theme == "0") {
                        window.alert(`테마를 선택해야 합니다.`);
                      } else if (this.state.url === "") {
                        window.alert(`영상을 첨부해야 합니다.`);
                      }
                    }}
                  >
                    →
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="elementDiv" id="selectNumAndGender">
            <div>
              <h4>참여 가능 성별</h4>
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
              <h4>(본인 포함) 주최 인원</h4>
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
                  <div
                    style={{
                      border:
                        this.state.theme === "1"
                          ? "1.5px solid rgb(255,87,115)"
                          : "1.5px solid white",
                      borderRadius: "100%",
                      padding: "5px",
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    <img
                      src={theme1Img}
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <h5
                    style={{
                      textAlign: "center",
                      margin: "3px auto",
                      width: "92px",
                      fontSize: "15px",
                      color:
                        this.state.theme === "1"
                          ? "rgb(255,87,115)"
                          : "#363636",
                    }}
                  >
                    맛집
                  </h5>
                </div>
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme2").click();
                  }}
                >
                  <div
                    style={{
                      border:
                        this.state.theme === "2"
                          ? "1.5px solid rgb(255,87,115)"
                          : "1.5px solid white",
                      borderRadius: "100%",
                      padding: "5px",
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    <img
                      src={theme2Img}
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <h5
                    style={{
                      textAlign: "center",
                      margin: "3px auto",
                      width: "92px",
                      fontSize: "15px",
                      color:
                        this.state.theme === "2"
                          ? "rgb(255,87,115)"
                          : "#363636",
                    }}
                  >
                    벙개
                  </h5>
                </div>
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme3").click();
                  }}
                >
                  <div
                    style={{
                      border:
                        this.state.theme === "3"
                          ? "1.5px solid rgb(255,87,115)"
                          : "1.5px solid white",
                      borderRadius: "100%",
                      padding: "5px",
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    <img
                      src={theme3Img}
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <h5
                    style={{
                      textAlign: "center",
                      margin: "3px auto",
                      width: "92px",
                      fontSize: "15px",
                      color:
                        this.state.theme === "3"
                          ? "rgb(255,87,115)"
                          : "#363636",
                    }}
                  >
                    음악
                  </h5>
                </div>
              </div>
              <div className="themeRow" style={{ marginTop: "10px" }}>
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme4").click();
                  }}
                >
                  <div
                    style={{
                      border:
                        this.state.theme === "4"
                          ? "1.5px solid rgb(255,87,115)"
                          : "1.5px solid white",
                      borderRadius: "100%",
                      padding: "5px",
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    <img
                      src={theme4Img}
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <h5
                    style={{
                      textAlign: "center",
                      margin: "3px auto",
                      width: "92px",
                      fontSize: "15px",
                      color:
                        this.state.theme === "4"
                          ? "rgb(255,87,115)"
                          : "#363636",
                    }}
                  >
                    여행
                  </h5>
                </div>
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme5").click();
                  }}
                >
                  <div
                    style={{
                      border:
                        this.state.theme === "5"
                          ? "1.5px solid rgb(255,87,115)"
                          : "1.5px solid white",
                      borderRadius: "100%",
                      padding: "5px",
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    <img
                      src={theme5Img}
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <h5
                    style={{
                      textAlign: "center",
                      margin: "3px auto",
                      width: "92px",
                      fontSize: "15px",
                      color:
                        this.state.theme === "5"
                          ? "rgb(255,87,115)"
                          : "#363636",
                    }}
                  >
                    소모임
                  </h5>
                </div>
                <div
                  className="themeImgDiv"
                  onClick={() => {
                    document.getElementById("selectTheme6").click();
                  }}
                >
                  <div
                    style={{
                      border:
                        this.state.theme === "6"
                          ? "1.5px solid rgb(255,87,115)"
                          : "1.5px solid white",
                      borderRadius: "100%",
                      padding: "5px",
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    <img
                      src={theme6Img}
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <h5
                    style={{
                      textAlign: "center",
                      margin: "3px auto",
                      width: "92px",
                      fontSize: "15px",
                      color:
                        this.state.theme === "6"
                          ? "rgb(255,87,115)"
                          : "#363636",
                    }}
                  >
                    운동
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
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
