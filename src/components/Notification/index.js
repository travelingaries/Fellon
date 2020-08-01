import React, { Component } from "react";
import TabBar from "../TabBar";
import NavBar from "../NavBar";

import { connect } from "react-redux";
import {
  getCurrentUserInfo,
  getUserPosts,
  getJoinRequestNotifications,
} from "../../actions";

import "./notification.css";

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
  render() {
    return (
      <div className="regular-index">
        <NavBar currentTab={this.state.currentTab} />
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
                style={{
                  backgroundColor: "blue",
                  height: "40px",
                  width: "100px",
                }}
              ></div>
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
