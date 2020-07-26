import React, { Component } from "react";
import ReactModal from "react-modal";
import TabBar from "../TabBar";
import NavBar from "../NavBar";

import "./My.css";
import backButton from "../../images/icoBack.png";

import firebase from "../../config/config.js";

import { connect } from "react-redux";
import { getCurrentUserInfo, logoutUser } from "../../actions";

class My extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 5,
      showModal: false,
      user: {},
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  componentDidMount() {
    this.props.getCurrentUserInfo().then(() => {
      this.setState({ user: this.props.user });
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
          dispatch(logoutUser());
        },
        function (error) {
          console.error("Sign Out Error", error);
        }
      );
  };

  render() {
    console.log("render with: ", this.state.user);
    return (
      <div className="regular-index">
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Settings"
          onRequestClose={this.handleCloseModal}
          className="settingsModal"
          overlayClassName="settingsOverlay"
          ariaHideApp="false"
          style={{ overlay: { background: "#a0a0a0" }, zIndex: "50000" }}
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
            style={{ display: this.state.showModal ? "none" : "block" }}
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
                  {this.state.user.age === 1 ? "20" : "30"}대 /{" "}
                  {this.state.user.gender === 1 ? "남" : "여"}
                </h6>
              </div>
              <div className="line  "></div>
            </div>
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
  };
}

export default connect(mapStateToProps, { getCurrentUserInfo })(My);
