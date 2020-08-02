import React, { Component } from "react";

import "./home.css";

import threeDotsButton from "../../images/icoThreeDots.png";

import { connect } from "react-redux";
import { getCurrentUserInfo, getAllPosts } from "../../actions";

import firebase from "../../config/config.js";
firebase.auth().useDeviceLanguage();

const firestore = firebase.firestore();
const storage = firebase.storage();

class HomeBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      user: {},
    };
  }

  componentDidMount() {
    this.props.getCurrentUserInfo().then(() => {
      this.setState({ user: this.props.user }, () => {
        console.log(`logged in as ${this.state.user.username}`);
      });
    });
    this.props.getAllPosts().then(() => {
      this.setState({ posts: this.props.posts }, () => {
        console.log("posts: ", this.state.posts);
      });
    });
  }

  deletePost(post) {
    console.log("initiate delete of post ", post);
    try {
      // delete post media from firebase storage
      const deleteTask = storage.ref(`userPosts/${post.media.name}`);
      deleteTask.delete().then(() => {
        console.log("media deleted from storage");
      });
      // delete post data from firestore
      firestore
        .collection("posts")
        .doc(`${post.createdAt} ${post.media.name}`)
        .delete()
        .then(() => {
          console.log("post data deleted from firestore");
        });
    } catch (err) {
      console.error(err);
    }
  }
  joinRequest(post) {
    console.log("requested to join: ", post);
    try {
      /* Add join requester's uid to post data */
      firestore
        .collection("posts")
        .doc(`${post.createdAt} ${post.media.name}`)
        .get()
        .then((doc) => {
          const prevJoinRequested = doc.data().joinRequested;
          return firestore
            .collection("posts")
            .doc(`${post.createdAt} ${post.media.name}`)
            .update({
              joinRequested: [...prevJoinRequested, this.state.user.uid],
            })
            .then(() => {
              console.log("join request successfully sent");

              /* Create join request notification data */
              const createdAt = new Date().toISOString();
              firestore
                .collection("notifications")
                .doc(
                  `${post.createdAt} ${post.user.uid} ${this.state.user.uid}`
                )
                .set({
                  post: {
                    docName: `${post.createdAt} ${post.media.name}`,
                    host: post.user.uid,
                    title: post.title,
                    createdAt: post.createdAt,
                  },
                  type: "join_request",
                  joinRequester: this.state.user,
                  createdAt,
                });

              this.componentDidMount();
            });
        });
    } catch (err) {
      console.error(err);
    }
  }
  cancelJoinRequest(post) {
    console.log("cancelling request to join: ", post);
    /* remove join requester data from post data */
    try {
      firestore
        .collection("posts")
        .doc(`${post.createdAt} ${post.media.name}`)
        .get()
        .then((doc) => {
          const prevJoinRequested = doc.data().joinRequested;
          for (var i = 0; i < prevJoinRequested.length; i++) {
            if (prevJoinRequested[i] === this.state.user.uid) {
              prevJoinRequested.splice(i, 1);
              i--;
            }
          }
          return firestore
            .collection("posts")
            .doc(`${post.createdAt} ${post.media.name}`)
            .update({
              joinRequested: [...prevJoinRequested],
            })
            .then(() => {
              console.log("join request successfully cancelled");

              /* remove join request nofication data */
              firestore
                .collection("notifications")
                .doc(`${post.media.name} ${this.state.user.uid}`)
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
      <div className="homeTabContainer">
        <div
          id="scrim"
          onClick={() => {
            /* Hide popped up post options */
            var listOptions = document.getElementsByClassName("postOptions");
            for (var i = 0; i < listOptions.length; i++) {
              listOptions[i].style["display"] = "none";
            }
            /* Hide popped up post prompts */
            var listPrompts = document.getElementsByClassName(
              "postDeletePrompt"
            );
            for (var i = 0; i < listPrompts.length; i++) {
              listPrompts[i].style["display"] = "none";
            }
            document.getElementById("scrim").style.display = "none";
          }}
        ></div>
        {this.state.posts.length === 0 ? (
          <div className="nothingHere">
            <h4 style={{ fontSize: "20px", textAlign: "center" }}>
              아직 영상이 없네요
            </h4>
            <p>업로드탭에서 첫 번째 영상을 올려보세요!</p>
          </div>
        ) : (
          <div></div>
        )}
        {this.state.posts.map((post, index) => {
          return (
            <div
              className="postContainer"
              key={index}
              id={"postContainer" + index}
            >
              {post.media.contentType.split("/")[0] === "image" ? (
                <img className="postMedia" src={post.media.url} />
              ) : post.media.contentType.split("/")[0] === "video" ? (
                <video controls className="postMedia">
                  <source src={post.media.url} type={post.media.contentType} />
                </video>
              ) : (
                <div></div>
              )}
              <div className="postSummaryContainer">
                <img
                  src={post.user.profileImageUrl}
                  className="posterProfileImage"
                />
                {/* If own post, show options */}
                {post.user.uid === this.state.user.uid ? (
                  <div>
                    <div
                      className="postOptionsButtonDiv"
                      onClick={() => {
                        document.getElementById(
                          "postOption" + index
                        ).style.display = "block";
                        document.getElementById("scrim").style.display =
                          "block";
                      }}
                    >
                      <img
                        src={threeDotsButton}
                        className="postOptionsButton"
                      />
                      <div
                        className="postOptions"
                        id={"postOption" + index}
                        onClick={(e) => {
                          // Show prompt for deleting post
                          document.getElementById(
                            "postDeletePrompt" + index
                          ).style.display = "block";
                        }}
                      >
                        <p>삭제</p>
                      </div>
                    </div>
                    <div
                      className="postDeletePrompt"
                      id={"postDeletePrompt" + index}
                    >
                      <h4 className="postDeletePromptDescription">
                        정말로 삭제하시겠습니까?
                      </h4>
                      <div className="postDeletePromptOptionsDiv">
                        <div
                          className="postDeletePromptOption postDeletePromptOptionYes"
                          id={"postDeletePromptOptionYes" + index}
                          onClick={() => {
                            document.getElementById("scrim").click();
                            this.deletePost(post);
                            document.getElementById(
                              "postContainer" + index
                            ).style.display = "none";
                          }}
                        >
                          네
                        </div>
                        <div
                          className="postDeletePromptOption postDeletePromptOptionNo"
                          id={"postDeletePromptOptionNo" + index}
                          onClick={() => {
                            document.getElementById("scrim").click();
                          }}
                        >
                          아니요
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
                <div className="postSummary">
                  <h4 className="postTitle">{post.title}</h4>
                  <p className="postDescription">
                    #{post.participantsNum}명이_주최{"  "}#
                    {post.gender === 1
                      ? "#남성 "
                      : post.gender === 2
                      ? "#여성 "
                      : "남녀혼성 "}
                    {"  "}#
                    {post.theme === "1"
                      ? "맛집"
                      : post.theme === "2"
                      ? "벙개"
                      : post.theme === "3"
                      ? "음악"
                      : post.theme === "4"
                      ? "여행"
                      : post.theme === "5"
                      ? "소모임"
                      : post.theme === "운동"}
                  </p>
                </div>
              </div>
              {/* If not own post, show join request button */}
              {post.user.uid !== this.state.user.uid ? (
                <div>
                  <div className="joinRequestButtonDiv">
                    {/* Show Join or Cancel Request Button */}
                    {!post.joinRequested.includes(this.state.user.uid) ? (
                      <div
                        className="joinRequestButton"
                        id={"joinRequestButton" + index}
                        onClick={() => {
                          if (
                            !post.joinRequested.includes(this.state.user.uid)
                          ) {
                            this.joinRequest(post);
                          } else {
                            this.cancelJoinRequest(post);
                          }
                        }}
                      >
                        <p className="joinRequestText">참여 신청</p>
                      </div>
                    ) : (
                      <div
                        className="cancelJoinRequestButton"
                        id={"cancelRequestButton" + index}
                        onClick={() => {
                          if (
                            !post.joinRequested.includes(this.state.user.uid)
                          ) {
                            this.joinRequest(post);
                          } else {
                            this.cancelJoinRequest(post);
                          }
                        }}
                      >
                        <p className="cancelJoinRequestText">참여 신청 취소</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    height: "14px",
                    width: "100%",
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    posts: state.posts.posts,
  };
}

export default connect(mapStateToProps, { getCurrentUserInfo, getAllPosts })(
  HomeBody
);
