import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import MyTabNavBar from "./MyTabNavBar";
import UploadTabNavBar from "./UploadTabNavBar";
import NotificationTabNavBar from "./NotificationTabNavBar";

import "./NavBar.css";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: this.props.currentTab,
    };
  }
  render() {
    if (this.state.currentTab == 1) {
      return <MyTabNavBar />;
    } else if (this.state.currentTab == 2) {
      return <MyTabNavBar />;
    } else if (this.state.currentTab == 3) {
      return <UploadTabNavBar />;
    } else if (this.state.currentTab == 4) {
      return <NotificationTabNavBar />;
    } else if (this.state.currentTab == 5) {
      return <MyTabNavBar />;
    }
  }
}

export default NavBar;
