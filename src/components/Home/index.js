import React, { Component } from "react";
import TabBar from "../TabBar";
import NavBar from "../NavBar";
import HomeBody from "./HomeBody";

import { connect } from "react-redux";
import { getCurrentUserInfo, getAllPosts } from "../../actions";

import firebase from "../../config/config.js";
firebase.auth().useDeviceLanguage();
const firestore = firebase.firestore();

class Home extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 1,
      user: {},
      posts: [],
    };
  }
  componentDidMount() {
    this.props.getCurrentUserInfo().then(() => {
      this.setState({ user: this.props.user }, () => {
        console.log(`logged in as ${this.state.user.username}`);
      });
    });
    this.props.getAllPosts().then(() => {
      this.setState({ posts: this.props.posts }, () => {
        console.log("posts: ", this.state.posts);
      });
    });
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

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    posts: state.posts.posts,
  };
}

export default connect(mapStateToProps, { getCurrentUserInfo, getAllPosts })(
  Home
);
