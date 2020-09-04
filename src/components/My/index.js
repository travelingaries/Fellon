import React, { Component } from "react";
import ReactModal from "react-modal";
import TabBar from "../TabBar";
import NavBar from "../NavBar";

import "./My.css";
import backButton from "../../images/icoBack.png";
import threeDotsButton from "../../images/icoThreeDots.png";

import { connect } from "react-redux";
import { getCurrentUserInfo, getUserPosts, logoutUser } from "../../actions";

import firebase from "../../config/config.js";
firebase.auth().useDeviceLanguage();
const firestore = firebase.firestore();
const storage = firebase.storage();

class My extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 5,
      showModal: false,
      user: {},
      userPosts: [],
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  componentDidMount() {
    this.props.getCurrentUserInfo().then(() => {
      this.setState({ user: this.props.user }, () => {
        this.props.getUserPosts().then(() => {
          this.setState({ userPosts: this.props.posts }, () => {
            console.log("user's posts: ", this.state.userPosts);
          });
        });
      });
    });
  }
  handleOpenModal() {
    this.setState({ showModal: true });
  }
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  logout = () => {
    const { dispatch } = this.props;
    firebase
      .auth()
      .signOut()
      .then(
        function () {
          console.log("Signed Out");
          //dispatch(logoutUser());
          window.location.href = "/start";
        },
        function (error) {
          console.error("Sign Out Error", error);
        }
      );
  };
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

  render() {
    return (
      <div className="regular-index">
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
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Settings"
          onRequestClose={this.handleCloseModal}
          className="settingsModal"
          overlayClassName="settingsOverlay"
          ariaHideApp="false"
          style={{ overlay: { background: "rgba(200, 200, 200, 0.5)"}, zIndex: "50000" }}
        >
          <div className="settingsModalContent">
            <div>
              <h3>설정</h3>
              <p>
                {" "}
                <span style={{ fontWeight: "bold" }}>
                  {" "}
                  보유중인 하트 개수:{" "}
                </span>
                <span style={{ fontWeight: "bold", color: "rgb(255,85,117)" }}>
                  000개
                </span>
              </p>
              <div
                className="buyHeartButton"
                onClick={() => {
                  alert("아직 지원되지 않는 기능입니다.");
                }}
              >
                <p style={{ fontWeight: "bold", textAlign: "center" }}>
                  지인 초대하고{" "}
                  <span style={{ color: "rgb(255,85,117)" }}>하트받기</span>
                </p>
              </div>
              <div
                style={{ marginTop: "20%", paddingBottom: "12%" }}
                onClick={() => {
                  window.location.href = "/editProfile";
                }}
              >
                <div style={{ float: "left" }}>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      margin: "0px",
                    }}
                  >
                    프로필 수정
                  </p>
                </div>
                <div style={{ float: "right" }}>
                  <img src={backButton} className="flip" />
                </div>
              </div>
              <div
                style={{ clear: "both", paddingTop: "4%" }}
                onClick={this.logout}
              >
                <div style={{ float: "left" }}>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      margin: "0px",
                    }}
                  >
                    로그아웃
                  </p>
                </div>
                <div style={{ float: "right" }}>
                  <img src={backButton} className="flip" />
                </div>
              </div>
            </div>
          </div>
        </ReactModal>
        <NavBar
          currentTab={this.state.currentTab}
          handleOpenModal={this.handleOpenModal}
          handleCloseModal={this.handleCloseModal}
          showModal={this.state.showModal}
        />
        <div className="container">
          <div
            className="myTabBody"
            style={{ display: "block" }}
          >
            <div className="profileSummaryDiv">
              <div className="profileImageDiv">
                <img
                  className="profileImage"
                  src={this.state.user.profileImageUrl}
                />
              </div>
              <div className="profileTextDiv">
                <h3>{this.state.user.username}</h3>
                <h6>
                  {this.state.user.age === 1 ? "20" : (this.state.user.age === 2 ? "30" : "40")}대 /{" "}
                  {this.state.user.gender === 1 ? "남" : "여"}
                </h6>
              </div>
              <div className="line  "></div>
            </div>

            {this.state.userPosts.length === 0 ? (
              <div className="nothingHere">
                <h4 style={{ fontSize: "20px", textAlign: "center" }}>
                  업로드한 영상이 없네요
                </h4>
                <p>
                  하단 업로드 버튼을 눌러 펠롱들에게
                  <br />
                  관심사와 매력을 어필해보세요.
                </p>
              </div>
            ) : (
              <h4>주최한 펠롱 모임 </h4>
            )}

            {/* Show user's posts */}
            {this.state.userPosts.map((post, index) => {
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
                      <source
                        src={post.media.url}
                        type={post.media.contentType}
                      />
                    </video>
                  ) : (
                    <div></div>
                  )}
                  <div className="postSummaryContainer">
                    <img
                      src={this.state.user.profileImageUrl}
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
                              className="postDeletePromptOption"
                              id="postDeletePromptOptionYes"
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
                              className="postDeletePromptOption"
                              id="postDeletePromptOptionNo"
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
                    <div
                      className="postSummary"
                      onClick={() => {
                        var list = document.getElementsByClassName(
                          "postOptions"
                        );
                        for (var i = 0; i < list.length; i++) {
                          list[i].style["display"] = "none";
                        }
                      }}
                    >
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
                                !post.joinRequested.includes(
                                  this.state.user.uid
                                )
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
                            className="joinRequestButton"
                            id={"cancelRequestButton" + index}
                            style={{ backgroundColor: "blue" }}
                            onClick={() => {
                              if (
                                !post.joinRequested.includes(
                                  this.state.user.uid
                                )
                              ) {
                                this.joinRequest(post);
                              } else {
                                this.cancelJoinRequest(post);
                              }
                            }}
                          >
                            <p className="joinRequestText">참여 신청 취소</p>
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

            {/* this.state.userPosts.length > 0 ? (
              <div className="postGridRow">
                <div className="postGridCell" onClick={() => {}}>
                  <img
                    src={this.state.user.profileImageUrl}
                    style={{ width: "80px", height: "80px" }}
                  />
                  <h5 className="postGridCellDescription">맛집</h5>
                </div>
                <div className="postGridCell" onClick={() => {}}>
                  <img
                    src={this.state.user.profileImageUrl}
                    style={{ width: "80px", height: "80px" }}
                  />
                  <h5 className="postGridCellDescription">벙개</h5>
                </div>
                <div className="postGridCell" onClick={() => {}}>
                  <img
                    src={this.state.user.profileImageUrl}
                    style={{ width: "80px", height: "80px" }}
                  />
                  <h5 className="postGridCellDescription">음악</h5>
                </div>
              </div>
            ) : (
              <div className="nothingHere">
                <h4 style={{ fontSize: "20px", textAlign: "center" }}>
                  업로드한 영상이 없네요
                </h4>
                <p>
                  하단 업로드 버튼을 눌러 펠롱들에게
                  <br />
                  관심사와 매력을 어필해보세요.
                </p>
              </div>
            )*/}
          </div>
        </div>
        <TabBar currentTab={this.state.currentTab} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError,
    user: state.auth.user,
    posts: state.posts.posts,
  };
}

export default connect(mapStateToProps, {
  getCurrentUserInfo,
  getUserPosts,
  logoutUser,
})(My);
