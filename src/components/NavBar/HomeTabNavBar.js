import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./NavBar.css";

import backButton from "../../images/icoBack.png";
import logoImg from "../../images/imgLogo_color@3x.png";

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
          style={{
            position: "fixed",
            top: "0",
            backgroundColor: "white",
            display: "flex",
          }}
        >
          <div
            onClick={this.handleClickSettings}
            style={{ visibility: "hidden" }}
          >
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
            <img
              style={{
                height: "24px",
                textAlign: "center",
                margin: "8px auto 0 auto",
              }}
              src={logoImg}
            />
          </div>
        </nav>
      </div>
    );
  }
}

export default HomeTabNavBar;
