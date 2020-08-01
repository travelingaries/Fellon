import React, { Component } from "react";

import "./NavBar.css";
import backButton from "../../images/icoBack.png";

class NotificationTabNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: this.props.currentTab,
    };
  }
  render() {
    return (
      <div>
        <nav
          className="navBar"
          id="notificationTabNavBar"
          style={{
            position: "fixed",
            top: "0",
            backgroundColor: "white",
            display: "flex",
          }}
        >
          <a href="/">
            <div>
              <img
                style={{ width: "20px", marginTop: "10px", marginLeft: "18px" }}
                src={backButton}
              />
            </div>
          </a>
          <div
            style={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "38px",
              width: "100%",
            }}
          >
            <h4 className="navCenterText">매칭</h4>
          </div>
        </nav>
      </div>
    );
  }
}

export default NotificationTabNavBar;
