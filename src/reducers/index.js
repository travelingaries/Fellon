import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import auth from "./auth";
import posts from "./posts";

export default combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  auth,
  posts,
});
