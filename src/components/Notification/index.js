import React, { Component } from "react";
import TabBar from "../TabBar";
import NavBar from "../NavBar";

class Notification extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 4,
    };
  }
  render() {
    return (
      <div className="regular-index">
        <NavBar currentTab={this.state.currentTab} />
        <div className="container">
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
        </div>
        <TabBar currentTab={this.state.currentTab} />
      </div>
    );
  }
}

export default Notification;
