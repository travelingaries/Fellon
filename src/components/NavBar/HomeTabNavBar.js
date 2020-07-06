import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./NavBar.css";

import backButton from "../../images/icoBack.png";

class HomeTabNavBar extends Component {
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
          id="HomeTabNavBar"
          style={{ position: "relative", display: "flex" }}
        >
          <div onClick={this.handleClickSettings}>
            <img
              style={{
                width: "20px",
                marginTop: "10px",
                marginLeft: "18px",
              }}
              src={backButton}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "38px",
              width: "100%",
            }}
          >
            <h4 className="navCenterText">Home</h4>
          </div>
        </nav>
      </div>
    );
  }
}

export default HomeTabNavBar;
