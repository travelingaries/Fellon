import React, { Component } from "react";
import Post from "../styledComponents/Post";

import "./home.css";

import { connect } from "react-redux";
import { getCurrentUserInfo, getAllPosts } from "../../actions";

import firebase from "../../config/config.js";
firebase.auth().useDeviceLanguage();
const firestore = firebase.firestore();

class HomeBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      user: {},
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
      <div className="startContainer">
        {this.state.posts.map((post) => {
          if (post.media.contentType.split("/")[0] === "image") {
            return (
              <div className="postContainer">
                <p>{post.title}</p>
                <img width="320" height="240" src={post.media.url} />
              </div>
            );
          } else if (post.media.contentType.split("/")[0] === "video") {
            return (
              <div className="postContainer">
                <p>{post.title}</p>
                <video width="320" height="240" controls>
                  <source src={post.media.url} type={post.media.contentType} />
                </video>
              </div>
            );
          }
        })}
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
  HomeBody
);
