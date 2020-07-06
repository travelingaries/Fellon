import React, { Component } from "react";
import TabBar from "../TabBar";
import NavBar from "../NavBar";
import HomeBody from "./HomeBody";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 1,
    };
  }
  render() {
    return (
      <div className="regular-index">
        <NavBar currentTab={this.state.currentTab} />
        <HomeBody />
        <TabBar currentTab={this.state.currentTab} />
      </div>
    );
  }
}

export default Home;
