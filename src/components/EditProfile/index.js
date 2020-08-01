import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Checkbox, Radio, rgbToHex, TextField } from "@material-ui/core";
import Button from "../styledComponents/Button.js";
import * as yup from "yup";

import "./editProfile.css";

import uploadProfilePicImg from "../../images/uploadProfileImage.jpg";
import xImg from "../../images/icoX.png";

import firebase from "../../config/config.js";

const firestore = firebase.firestore();
const storage = firebase.storage();

const nameRegex = /^[가-힣a-z0-9]+$/;
const validationSchema = yup.object({
  username: yup
    .string()
    .matches(nameRegex, "닉네임은 한글, 영문 소문자, 또는 숫자만 가능합니다.")
    .required("닉네임을 입력해주세요")
    .max(16, "닉네임은 16자까지만 가능합니다"),
  age: yup.number().min(1).max(2).required(),
  gender: yup.number().min(1).max(2).required(),
});

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 6,
      image: null,
      imageName: "",
      url: "",
      progress: 0,
      currentUserDoc: null,
      username: "await",
      gender: 0,
      age: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }
  componentWillMount() {
    this.setState({
      currentUserDoc: firestore
        .collection("users")
        .doc(firebase.auth().currentUser.uid),
    });
  }
  componentDidMount() {
    this.state.currentUserDoc.get().then((doc) => {
      if (doc && doc.data().username) {
        this.setState({ username: doc.data().username }, () => {});
      }
    });
    this.state.currentUserDoc.get().then((doc) => {
      if (doc && doc.data().profileImageUrl) {
        this.setState({ url: doc.data().profileImageUrl });
      }

      if (doc && doc.data().gender) {
        this.setState({ gender: doc.data().gender });
      }
      if (doc && doc.data().age) {
        this.setState({ age: doc.data().age });
      }
    });
  }
  handleChange(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(
        {
          image,
          imageName:
            firebase.auth().currentUser.uid +
            new Date().toISOString() +
            image.name,
        },
        () => {
          this.handleImageUpload();
        }
      );
    }
  }
  handleImageUpload() {
    const { image, imageName } = this.state;

    const storageRef = storage.ref(`profileImages/${imageName}`);
    const uploadTask = storageRef.put(image);
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
          ("Error while uploading image to Firebase storage: ", error)
        );
      },
      () => {
        // Complete function
        console.log("image upload completed");
        this.setState({ progress: 0 });
        storageRef.getDownloadURL().then((url) => {
          this.setState({ url }, () => {
            console.log("image url in storage: ", url);
            const currentUserDoc = firestore
              .collection("users")
              .doc(firebase.auth().currentUser.uid);
            // Delete previous profile image from storage if it exists
            currentUserDoc.get().then((doc) => {
              if (doc.data().profileImageUrlName) {
                const deleteTask = storage
                  .ref("profileImages")
                  .child(doc.data().profileImageUrlName);
                if (deleteTask != null) {
                  try {
                    deleteTask.delete().then(() => {
                      // Add new profile image data to firestore
                      const userData = {
                        profileImageUrl: this.state.url,
                        profileImageUrlName: this.state.imageName,
                      };
                      currentUserDoc.update(userData).then(() => {
                        console.log(`user's profile pic was updated`);
                      });
                    });
                  } catch (error) {
                    console.log(
                      "error while deleting previous profile image: ",
                      error
                    );
                    // Add new profile image data to firestore
                    const userData = {
                      profileImageUrl: this.state.url,
                      profileImageUrlName: this.state.imageName,
                    };
                    currentUserDoc.update(userData).then(() => {
                      console.log(`user's profile pic was updated`);
                    });
                  }
                } else {
                  // Add new profile image data to firestore
                  const userData = {
                    profileImageUrl: this.state.url,
                    profileImageUrlName: this.state.imageName,
                  };
                  currentUserDoc.update(userData).then(() => {
                    console.log(`user's profile pic was updated`);
                  });
                }
              } else {
                // Add new profile image data to firestore
                const userData = {
                  profileImageUrl: this.state.url,
                  profileImageUrlName: this.state.imageName,
                };
                currentUserDoc.update(userData).then(() => {
                  console.log(`user's profile pic was updated`);
                });
              }
            });
          });
        });
      }
    );
  }
  submitUserData(data) {
    const { username } = data;
    const age = parseInt(data.gender);
    const gender = parseInt(data.gender);
    const userData = {
      username,
      age,
      gender,
    };
    this.state.currentUserDoc.update(userData).then(() => {
      console.log("user's profile data was updated");
      window.location.href = "/profile";
    });
  }

  render() {
    return (
      <div>
        <nav
          className="navBar"
          id="editProfileNavBar"
          style={{
            position: "relative",
            display: "flex",
            visibility: this.state.username !== "" ? "visible" : "hidden",
          }}
        >
          <a href="/profile">
            <div>
              <img
                style={{
                  width: "20px",
                  marginTop: "10px",
                  marginLeft: "18px",
                }}
                src={xImg}
              />
            </div>
          </a>
          <div
            style={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "38px",
              width: "100%",
            }}
          >
            <h4 className="navCenterText">프로필 수정</h4>
          </div>
        </nav>
        <div className="regular-index-editProfile">
          <div className="container">
            <div
              className="setProfilePictureDiv"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                var uploadProfileImageInput = document.getElementById(
                  "uploadProfileImageInput"
                );
                uploadProfileImageInput.click();
              }}
            >
              <div
                style={{ width: "120px", height: "120px", alignSelf: "center" }}
              >
                <img
                  src={this.state.url || uploadProfilePicImg}
                  alt="uploaded image"
                  style={{
                    borderRadius: "50%",
                    justifySelf: "center",
                    height: "120px",
                    width: "120px",
                  }}
                />
              </div>
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
            <div>
              <input
                type="file"
                id="uploadProfileImageInput"
                onChange={this.handleChange}
                style={{ display: "block", visibility: "hidden" }}
                accept="image/*"
              ></input>
            </div>
            <Formik
              enableReinitialize
              initialValues={{
                username: this.state.username,
                age: `${this.state.age}`,
                gender: `${this.state.gender}`,
              }}
              validationSchema={validationSchema}
              onSubmit={(data, { setSubmitting }) => {
                setSubmitting(true);
                console.log("submit: ", data);
                this.submitUserData(data);
                setSubmitting(false);
              }}
            >
              {({ values, errors, isSubmitting }) => (
                <Form>
                  <Field
                    type="text"
                    name="username"
                    as={TextField}
                    required
                    placeholder="닉네임 (한글, 영문 소문자, 숫자)"
                    className="usernameTextField"
                    value={values.username}
                  />
                  <h4>성별</h4>
                  <Field name="gender" type="radio" value="1" as={Radio} />{" "}
                  <label>남</label>
                  <Field
                    name="gender"
                    type="radio"
                    value="2"
                    as={Radio}
                    style={{ marginLeft: "25%" }}
                  />{" "}
                  <label>여</label>
                  <h4>나이</h4>
                  <Field name="age" type="radio" value="1" as={Radio} />{" "}
                  <label>20대</label>
                  <Field
                    name="age"
                    type="radio"
                    value="2"
                    as={Radio}
                    style={{ marginLeft: "20%" }}
                  />{" "}
                  <label>30대</label>
                  <div className="nextSignUpButton">
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      className="consentSubmitButton"
                      style={{
                        backgroundColor:
                          Object.keys(errors).length === 0 &&
                          values.username &&
                          values.age &&
                          values.gender
                            ? "#f50057"
                            : "rgb(221,221,221)",
                      }}
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
          </div>
        </div>
      </div>
    );
  }
}

export default EditProfile;
