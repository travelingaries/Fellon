import React, { Component } from "react";
import NavBar from "../NavBar";
import UploadTabTabBar from "../TabBar";

import "./Upload.css";

import uploadImg from "../../images/icoUploadVideo.png";
import theme1Img from "../../images/theme1.jpg";
import theme2Img from "../../images/theme2.jpg";
import theme3Img from "../../images/theme3.jpg";
import theme4Img from "../../images/theme4.jpg";
import theme5Img from "../../images/theme5.jpg";
import theme6Img from "../../images/theme6.jpg";
import checkImg from "../../images/imgCheck.png";
import minusImgOff from "../../images/icoMinusOff.png";
import plusImgOn from "../../images/icoPlusOn.png";

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 3,
      title: "",
      gender: -1,
      theme: "",
    };
  }

  render() {
    return (
      <div className="regular-index">
        <NavBar currentTab={this.state.currentTab} />
        <div className="container">
          <div className="elementDiv">
            <div style={{ float: "left" }}>
              <h4 style={{ marginBottom: "0px" }}>동영상 업로드</h4>
              <p style={{ color: "rgb(180,180,180)", fontSize: "12px" }}>
                베타버전은 사진보관함에 있는 동영상 <br />
                파일만 업로드 기능만 제공합니다.
              </p>
            </div>
            <div className="uploadButtonDiv">
              <img style={{ width: "46px" }} src={uploadImg} />
            </div>
          </div>
          <div className="elementDiv">
            <div>
              <h4>제목</h4>
              <input
                className="lineInput"
                placeholder="최대 11글자 (예: 치맥벙개)"
              />
            </div>
          </div>
          <div className="elementDiv">
            <div>
              <h4>인원·성별</h4>
              <div>
                <div className="genderSelectDiv">
                  <div style={{ float: "left", paddingBottom: "4px" }}>
                    <h6>남성</h6>
                  </div>
                  <div style={{ float: "right" }}>
                    <img className="checkmark" src={checkImg} />
                  </div>
                </div>
                <div className="genderSelectDiv">
                  <div style={{ float: "left", paddingBottom: "4px" }}>
                    <h6>여성</h6>
                  </div>
                  <div style={{ float: "right" }}>
                    <img className="checkmark" src={checkImg} />
                  </div>
                </div>
                <div className="genderSelectDiv">
                  <div style={{ float: "left", paddingBottom: "4px" }}>
                    <h6>남녀혼성</h6>
                  </div>
                  <div style={{ float: "right" }}>
                    <img className="checkmark" src={checkImg} />
                  </div>
                </div>
              </div>
              <div className="numSelectDiv">
                <div>
                  <button>
                    <img src={minusImgOff} />
                  </button>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginTop: "3px",
                      marginBottom: "0px",
                    }}
                  >
                    2명
                  </p>
                </div>
                <div>
                  <button>
                    <img src={plusImgOn} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="elementDiv">
            <div>
              <h4>테마</h4>
              <div className="themeRow">
                <div className="themeImgDiv">
                  <img src={theme1Img} />
                </div>
                <div className="themeImgDiv">
                  <img src={theme2Img} />
                </div>
                <div className="themeImgDiv">
                  <img src={theme3Img} />
                </div>
              </div>
              <div className="themeRow">
                <div className="themeImgDiv">
                  <img src={theme4Img} />
                </div>
                <div className="themeImgDiv">
                  <img src={theme5Img} />
                </div>
                <div className="themeImgDiv">
                  <img src={theme6Img} />
                </div>
              </div>
              <input
                style={{ marginTop: "5px" }}
                className="lineInput"
                placeholder="직접 입력 (최대 6글자)"
              />
            </div>
          </div>
        </div>
        <UploadTabTabBar />
      </div>
    );
  }
}

export default Upload;
