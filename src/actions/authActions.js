import * as actions from "./actionTypes";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";

import profilePic from "../images/icoBack.png";

export const login = ({ phoneNumber, appVerifier }, history) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  dispatch({ type: actions.AUTH_START });
  try {
    console.log(phoneNumber);
    await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);

    dispatch({ type: actions.AUTH_SUCCESS });

    history.push("/");
  } catch (err) {
    console.log(err);
    dispatch({ type: actions.AUTH_FAIL, payload: err.message });
  }

  dispatch({ type: actions.AUTH_END });
};

export const signUp = ({ phoneNumber, appVerifier }, history) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();

  dispatch({ type: actions.AUTH_START });
  try {
    await firebase
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

    const user = firebase.auth().currentUser;

    const newInfo = {
      phoneNumber: phoneNumber,
    };

    history.push({
      pathname: "/",
      state: newInfo,
    });
  } catch (err) {
    dispatch({ type: actions.AUTH_FAIL, payload: err.message });
  }
  dispatch({ type: actions.AUTH_END });
};

export const logout = (history) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();

  try {
    await firebase.auth().signOut();

    dispatch({ type: actions.OVERWRITE_CURRENT_USER, payload: {} });
    history.push("/");
  } catch (err) {
    console.log(err.message);
  }
};

export const getCurrentUserInfo = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  //const firestore = getFirestore();
  const user = firebase.auth().currentUser;

  try {
    const newInfo = {
      phoneNumber: user.phoneNumber,
    };
    dispatch({
      type: actions.OVERWRITE_CURRENT_USER,
      payload: newInfo,
    });
  } catch (err) {
    console.log(err);
  }
};
