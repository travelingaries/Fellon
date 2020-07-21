import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Checkbox, Radio, rgbToHex, TextField } from "@material-ui/core";
import Button from "../styledComponents/Button.js";
import * as yup from "yup";

import "./editProfile.css";

import uploadProfilePicImg from "../../images/uploadProfileImage.jpg";
import xImg from "../../images/icoX.png";

import TabBar from "../TabBar";

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
  age: yup.number().min(18).max(100).required(),
  gender: yup.number().min(1).max(2).required(),
});

class Notification extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 6,
      image: null,
      url: "",
      progress: 0,
      currentUserDoc: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }
  componentDidMount() {
    this.setState(
      {
        currentUserDoc: firestore
          .collection("users")
          .doc(firebase.auth().currentUser.uid),
      },
      () => {
        this.state.currentUserDoc.get().then((doc) => {
          if (doc && doc.data().profileImageUrl) {
            this.setState({ url: doc.data().profileImageUrl });
          }
        });
      }
    );
  }
  handleChange(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState({ image }, () => {
        this.handleImageUpload();
      });
    }
  }
  handleImageUpload() {
    const { image } = this.state;
    console.log("image: ", image);
    const storageRef = storage.ref(`profileImages/${image.name}`);
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
                try {
                  const deleteTask = storage
                    .ref("profileImages")
                    .child(doc.data().profileImageUrlName);
                  deleteTask.delete().then(() => {
                    // Add new profile image data to firestore
                    const userData = {
                      profileImageUrl: this.state.url,
                      profileImageUrlName: this.state.image.name,
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
                    profileImageUrlName: this.state.image.name,
                  };
                  currentUserDoc.update(userData).then(() => {
                    console.log(`user's profile pic was updated`);
                  });
                }
              }
            });
          });
        });
      }
    );
  }
  submitUserData(data) {
    const { username, age } = data;
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
      <div className="regular-index">
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
            initialValues={{
              username: "",
              age: 0,
              gender: 0,
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
                <Field
                  type="number"
                  name="age"
                  as={TextField}
                  style={{ width: "100%" }}
                  placeholder="예: 20"
                />
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
    );
  }
}

export default Notification;
