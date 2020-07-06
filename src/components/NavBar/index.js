import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import MyTabNavBar from "./MyTabNavBar";
import UploadTabNavBar from "./UploadTabNavBar";
import NotificationTabNavBar from "./NotificationTabNavBar";
import HomeTabNavBar from "./HomeTabNavBar";

import "./NavBar.css";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: this.props.currentTab,
    };
  }
  render() {
    if (this.state.currentTab === 1) {
      return <HomeTabNavBar />;
    } else if (this.state.currentTab === 2) {
      return <MyTabNavBar />;
    } else if (this.state.currentTab === 3) {
      return <UploadTabNavBar />;
    } else if (this.state.currentTab === 4) {
      return <NotificationTabNavBar />;
    } else if (this.state.currentTab === 5) {
      return (
        <MyTabNavBar
          handleOpenModal={this.props.handleOpenModal}
          handleCloseModal={this.props.handleCloseModal}
          showModal={this.state.showModal}
        />
      );
    }
  }
}

export default NavBar;
