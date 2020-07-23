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
              width: "100%",
              marginLeft: "40px",
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
      </div>
    );
  }
}

export default MyTabNavBar;
