import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./signupnavbar.css";

import backImg from "../../images/icoBack.png";

class LoginNavBar extends Component {
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
          id="myTabNavBar"
          style={{ position: "relative", display: "flex" }}
        >
          <a href="/">
            <div>
              <img
                style={{ width: "20px", marginTop: "10px", marginLeft: "18px" }}
                src={backImg}
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
            <h4 className="navCenterText">로그인하기</h4>
          </div>
        </nav>
      </div>
    );
  }
}

export default LoginNavBar;
