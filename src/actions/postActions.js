import {
  GET_ALL_POSTS,
  GET_USER_POSTS,
  GET_JOIN_REQUEST_NOTIFICATIONS,
  GET_USER_NOTIFICATIONS,
} from "../actions/actionTypes";

import firebase from "../config/config.js";
const firestore = firebase.firestore();

export const getAllPosts = () => async (dispatch) => {
  try {
    const posts = await firestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get()
      .then((posts) => {
        return (posts = posts.docs.map((doc) => doc.data()));
      });
    for (var i = 0; i < posts.length; i++) {
      posts[i].user.profileImageUrl = await firestore
        .collection("users")
        .doc(posts[i].user.uid)
        .get()
        .then((doc) => {
          if(doc.data().profileImageUrl)
            return doc.data().profileImageUrl;
          else return "https://firebasestorage.googleapis.com/v0/b/fellon-46901.appspot.com/o/profileImages%2Fno_user_photo.png?alt=media&token=8922884c-621b-4374-aa0e-f9b65d1408b2";
        });
    }
    dispatch({
      type: GET_ALL_POSTS,
      posts,
    });
  } catch (err) {
    console.error(err);
  }
};

export const getUserPosts = () => async (dispatch) => {
  try {
    const posts = await firestore
      .collection("posts")
      .where("user.uid", "==", firebase.auth().currentUser.uid)
      .orderBy("createdAt", "desc")
      .get()
      .then((posts) => {
        return (posts = posts.docs.map((doc) => doc.data()));
      });
    dispatch({
      type: GET_USER_POSTS,
      posts,
    });
  } catch (err) {
    console.error(err);
  }
};

export const getUserNotifications = () => async (dispatch) => {
  try {
    const notifications = await firestore
      .collection("notifications")
      .where("relevantUsers", "array-contains", firebase.auth().currentUser.uid)
      .orderBy("createdAt", "desc")
      .get()
      .then((notifications) => {
        return (notifications = notifications.docs.map((doc) => doc.data()));
      });
    dispatch({
      type: GET_USER_NOTIFICATIONS,
      notifications,
    });
  } catch (err) {
    console.error(err);
  }
};

export const getJoinRequestNotifications = () => async (dispatch) => {
  try {
    const notifications = await firestore
      .collection("notifications")
      .where("type", "==", "join_request")
      .where("post.host", "==", firebase.auth().currentUser.uid)
      .orderBy("createdAt", "desc")
      .get()
      .then((notifications) => {
        return (notifications = notifications.docs.map((doc) => doc.data()));
      });
    dispatch({
      type: GET_JOIN_REQUEST_NOTIFICATIONS,
      notifications,
    });
  } catch (err) {
    console.error(err);
  }
};
