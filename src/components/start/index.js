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
          <a href="/signUp" className="startOptions">
            <p style={{ marginTop: "30vh" }}>가입하기</p>
          </a>
          <a href="/login" className="startOptions">
            <p style={{ marginTop: "3vh" }}>로그인</p>
          </a>
        </div>
      </div>
    );
  }
}

export default Start;
