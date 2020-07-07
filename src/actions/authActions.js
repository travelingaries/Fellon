import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
} from "../actions/actionTypes";

import firebase from "../config/config.js";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import { reduxFirestore, getFirestore } from "redux-firestore";

const requestLogin = () => {
  return {
    type: LOGIN_REQUEST,
  };
};
const receiveLogin = (user) => {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
};
const loginError = () => {
  return {
    type: LOGIN_FAILURE,
  };
};
const requestLogout = () => {
  return {
    type: LOGOUT_REQUEST,
  };
};
const receiveLogout = (user) => {
  return {
    type: LOGOUT_SUCCESS,
    user,
  };
};
const logoutError = () => {
  return {
    type: LOGOUT_FAILURE,
  };
};
const verifyRequest = () => {
  return {
    type: VERIFY_REQUEST,
  };
};
const verifySuccess = (user) => {
  return {
    type: VERIFY_SUCCESS,
    user,
  };
};

export const loginUser = (phoneNumber, appVerifier) => (dispatch) => {
  dispatch(requestLogin());
  try {
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((user) => {
        dispatch(receiveLogin(user));
      });
  } catch (err) {
    console.log(err);
    dispatch({ type: LOGIN_FAILURE, payload: err.message });
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(requestLogout());
  try {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(receiveLogout());
      });
  } catch (err) {
    console.log(err.message);
    dispatch({ type: LOGOUT_FAILURE, payload: err.message });
  }
};

export const verifyAuth = () => (dispatch) => {
  dispatch(verifyRequest());
  try {
    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        dispatch(receiveLogin(user));
      }
      dispatch(verifySuccess());
    });
  } catch (err) {
    console.log(err.message);
  }
};
