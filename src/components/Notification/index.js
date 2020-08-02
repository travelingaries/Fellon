import React, { Component } from "react";
import TabBar from "../TabBar";
import NavBar from "../NavBar";

import { connect } from "react-redux";
import {
  getCurrentUserInfo,
  getUserPosts,
  getJoinRequestNotifications,
  getUserNotifications,
} from "../../actions";

import "./notification.css";

import firebase from "../../config/config.js";
firebase.auth().useDeviceLanguage();

const firestore = firebase.firestore();
const storage = firebase.storage();

class Notification extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 4,
      user: {},
      notifications: [],
    };
  }
  componentDidMount() {
    this.props.getCurrentUserInfo().then(() => {
      this.setState({ user: this.props.user }, () => {
        this.props.getJoinRequestNotifications().then(() => {
          this.setState({ notifications: this.props.notifications }, () => {
            console.log("notifications: ", this.state.notifications);
          });
        });
      });
    });
  }
  acceptJoinRequest(notification) {
    console.log("accepting join request");
    /* moving join requester data within post data */
    try {
      firestore
        .collection("posts")
        .doc(`${notification.post.docName}`)
        .get()
        .then((doc) => {
          const prevJoinRequested = doc.data().joinRequested;
          const prevMatchedWith = doc.data().matchedWith;
          for (var i = 0; i < prevJoinRequested.length; i++) {
            if (prevJoinRequested[i] === notification.joinRequester.uid) {
              prevJoinRequested.splice(i, 1);
              i--;
            }
          }
          return firestore
            .collection("posts")
            .doc(`${notification.post.docName}`)
            .update({
              joinRequested: [...prevJoinRequested],
              matchedWith: [...prevMatchedWith, notification.joinRequester.uid],
            })
            .then(() => {
              console.log("join requester matched in post data");

              const createdAt = new Date().toISOString();

              /* add matched with requester nofication data (for host) */

              firestore
                .collection("notifications")
                .doc(
                  `${notification.post.createdAt} ${notification.post.host} ${notification.joinRequester.uid} host`
                )
                .set({
                  post: notification.post,
                  type: "matched_with_requester",
                  joinRequester: notification.joinRequester,
                  createdAt,
                })
                .then(() => {
                  console.log("issued notification for host");

                  /* add matched with host nofication data (for requester) */
                  firestore
                    .collection("notifications")
                    .doc(
                      `${notification.post.createdAt} ${notification.post.host} ${notification.joinRequester.uid} requester`
                    )
                    .set({
                      post: notification.post,
                      type: "matched_with_host",
                      joinRequester: notification.joinRequester,
                      createdAt,
                    })
                    .then(() => {
                      console.log("issued notification for requester");

                      /* remove join request nofication data */
                      firestore
                        .collection("notifications")
                        .doc(
                          `${notification.post.createdAt} ${notification.post.host} ${notification.joinRequester.uid}`
                        )
                        .delete()
                        .then(() => {
                          console.log(
                            "join request notification data successfully deleted from firestore"
                          );
                          this.componentDidMount();
                        });
                    });
                });
            });
        });
    } catch (err) {
      console.error(err);
    }
  }
  refuseJoinRequest(notification) {
    console.log("refusing join request");
    /* remove join requester data from post data */
    try {
      firestore
        .collection("posts")
        .doc(`${notification.post.docName}`)
        .get()
        .then((doc) => {
          const prevJoinRequested = doc.data().joinRequested;
          for (var i = 0; i < prevJoinRequested.length; i++) {
            if (prevJoinRequested[i] === notification.joinRequester.uid) {
              prevJoinRequested.splice(i, 1);
              i--;
            }
          }
          return firestore
            .collection("posts")
            .doc(`${notification.post.docName}`)
            .update({
              joinRequested: [...prevJoinRequested],
            })
            .then(() => {
              console.log("join request refused in post data");

              /* remove join request nofication data */
              firestore
                .collection("notifications")
                .doc(
                  `${notification.post.createdAt} ${notification.post.host} ${notification.joinRequester.uid}`
                )
                .delete()
                .then(() => {
                  console.log(
                    "join request notification data successfully deleted from firestore"
                  );
                });

              this.componentDidMount();
            });
        });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return (
      <div className="regular-index">
        <NavBar currentTab={this.state.currentTab} />
        <div
          id="scrim"
          onClick={() => {
            /* Hide popped up join request prompts */
            var listPrompts = document.getElementsByClassName(
              "joinRequestPrompt"
            );
            for (var i = 0; i < listPrompts.length; i++) {
              listPrompts[i].style["display"] = "none";
            }
            document.getElementById("joinRequestPrompt0").style.display =
              "none";
            document.getElementById("scrim").style.display = "none";
            console.log("i can");
          }}
        ></div>
        <div className="container">
          {this.state.notifications.length !== 0 ? (
            <div style={{ marginBottom: "10px" }}></div>
          ) : (
            <div className="nothingHere">
              <div>
                <h4 style={{ fontSize: "20px", textAlign: "center" }}>
                  아직 매칭된 내역이 없네요
                </h4>
                <p>
                  매력 가득한 펠롱들에게 좋아요를
                  <br />
                  누르고 답장을 기다려보세요~
                </p>
              </div>
            </div>
          )}
          {this.state.notifications.map((notification, index) => {
            return (
              <div
                className="notificationContainer"
                key={index}
                id={"notificationContainer" + index}
                onClick={() => {
                  /* Show notification detail pop up */
                  document.getElementById("scrim").style.display = "block";
                  document.getElementById(
                    "joinRequestPrompt" + index
                  ).style.display = "block";
                }}
              >
                <img
                  src={notification.joinRequester.profileImageUrl}
                  className="joinRequesterProfileImage"
                />
                <div className="notificationDescription">
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      {notification.joinRequester.username}
                    </span>
                    님이{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {notification.post.title}
                    </span>
                    에 참여 신청했습니다.
                  </p>
                </div>
                <div
                  className="joinRequestPrompt"
                  id={"joinRequestPrompt" + index}
                >
                  <h4>참여 신정자</h4>
                  <div className="joinRequesterDetails">
                    <img
                      className="joinRequesterProfileImageDetailed"
                      src={notification.joinRequester.profileImageUrl}
                    />
                    <div className="joinRequesterProfileDescription">
                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          {notification.joinRequester.username}
                        </span>
                        <br />
                        <br />
                        <span style={{ fontWeight: "bold" }}>나이</span>:{" "}
                        {notification.joinRequester.age === 1 ? "20대" : "30대"}
                        <br />
                        <span style={{ fontWeight: "bold" }}>성별</span>:{" "}
                        {notification.joinRequester.gender === 1 ? "남" : "여"}
                        <br />
                      </p>
                    </div>
                    <div className="joinRequestPromptOptionsDiv">
                      <div
                        className="joinRequestPromptOption joinRequestPromptOptionYes"
                        id={"joinRequestPromptOptionYes" + index}
                        onClick={() => {
                          this.acceptJoinRequest(notification);
                        }}
                      >
                        수락하기
                      </div>
                      <div
                        className="joinRequestPromptOption joinRequestPromptOptionNo"
                        id={"joinRequestPromptOptionNo" + index}
                        onClick={() => {
                          this.refuseJoinRequest(notification);
                        }}
                      >
                        거절하기
                      </div>
                    </div>
                    <p style={{ textAlign: "center" }}>
                      수락할 시 연락처가 서로 공개됩니다.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <TabBar currentTab={this.state.currentTab} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    notifications: state.posts.notifications,
  };
}

export default connect(mapStateToProps, {
  getCurrentUserInfo,
  getUserPosts,
  getJoinRequestNotifications,
})(Notification);
