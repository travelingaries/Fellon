import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import UploadTabTabBar from "./UploadTabTabBar";
import "./TabBar.css";

import MyTabImgOn from "../../images/icoMyOn.png";
import MyTabImgOff from "../../images/icoMyOff.png";
import NotificationTabImgOff from "../../images/icoAlarmOff.png";
import NotificationTabImgOn from "../../images/icoAlarmOn.png";
import AddTabImgOn from "../../images/icoAdd.png";
import SearchTabImgOff from "../../images/icoSearchOff.png";
import SearchTabImgOn from "../../images/icoSearchOn.png";
import HomeTabImgOff from "../../images/icoHomeOff.png";
import HomeTabImgOn from "../../images/icoHomeOn.png";

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: this.props.currentTab,
    };
  }
  render() {
    if (
      this.state.currentTab === 1 ||
      this.state.currentTab === 2 ||
      this.state.currentTab === 4 ||
      this.state.currentTab === 5
    ) {
      return (
        <footer>
          <nav style={{ position: "relative" }}>
            <div className="tabBar">
              <a href="/">
                <div className="tab">
                  <img
                    src={
                      this.state.currentTab === 1 ? HomeTabImgOn : HomeTabImgOff
                    }
                  />
                </div>
              </a>
              <a href="/search">
                <div className="tab">
                  <img
                    src={
                      this.state.currentTab === 2
                        ? SearchTabImgOn
                        : SearchTabImgOff
                    }
                  />
                </div>
              </a>
              <a href="/upload">
                <div className="tab">
                  <img src={AddTabImgOn} />
                </div>
              </a>
              <a href="/notification">
                <div className="tab">
                  <img
                    src={
                      this.state.currentTab === 4
                        ? NotificationTabImgOn
                        : NotificationTabImgOff
                    }
                  />
                </div>
              </a>
              <a href="/profile">
                <div className="tab">
                  <img
                    src={this.state.currentTab === 5 ? MyTabImgOn : MyTabImgOff}
                  />
                </div>
              </a>
            </div>
          </nav>
        </footer>
      );
    } else {
      return <UploadTabTabBar />;
    }
  }
}

export default TabBar;
