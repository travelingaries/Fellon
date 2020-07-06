import React, { Component } from "react";

import logoImg from "../../images/imgLogo.png";

import "./start.css";

class Start extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="startBackground">
        <div className="startContainer">
          <h3 className="introHeading">
            펠롱 -
            <br />
            반갑습니다
          </h3>
          <img className="logoImg" src={logoImg} />
          <p className="descriptionText">
            숏클립 기반 펠로우들을 만날 수 있는 살롱
          </p>
          <a href="/signup" className="startOptions">
            <div
              style={{
                maxWidth: "320px",
                height: "36px",
                border: "1px solid white",
                marginTop: "35vh",
                paddingBottom: "16px",
                borderRadius: "5px",
              }}
            >
              <p style={{ textAlign: "center" }}>가입하기 / 로그인</p>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

export default Start;
