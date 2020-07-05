import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./NavBar.css";

import threeDots from "../../images/icoThreeDots.png";

class MyTabNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: this.props.currentTab,
    };
    this.handleClickSettings = this.handleClickSettings.bind(this);
  }
  handleClickSettings() {
    if (this.props.showModal) {
      this.props.handleCloseModal();
    } else {
      this.props.handleOpenModal();
    }
  }
  render() {
    return (
      <div>
        <nav
          className="navBar"
          id="myTabNavBar"
          style={{ position: "relative", display: "flex" }}
        >
          <div
            style={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "38px",
              width: "100%",
            }}
          >
            <h4 className="navCenterText">My</h4>
          </div>
          <div onClick={this.handleClickSettings}>
            <img
              style={{
                width: "20px",
                marginTop: "10px",
                marginRight: "18px",
              }}
              src={threeDots}
            />
          </div>
        </nav>
        <nav>
          <div className="myTabTabs" id="myUploadedTab">
            <h3>업로드한 영상</h3>
            <div className="tabUnderline"></div>
          </div>
          <div className="myTabTabs" id="myLikedTab">
            <h3>좋아요한 영상</h3>
            <div className="tabUnderline"></div>
          </div>
        </nav>
      </div>
    );
  }
}

export default MyTabNavBar;
