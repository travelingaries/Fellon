import React, { Component } from "react";
import TabBar from "../TabBar";
import NavBar from "../NavBar";

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
        <h1>Welcome Home</h1>
        <TabBar currentTab={this.state.currentTab} />
      </div>
    );
  }
}

export default Home;
