import React, { Component } from "react";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.post.title,
      gender: this.props.post.gender,
      theme: this.props.post.gender,
      participantsNum: this.props.post.participantsNum,
      videoName: this.props.post.videoName,
      videoUrl: this.props.post.videoUrl,
      userUid: this.props.post.user.uid,
      createdAt: this.props.post.createdAt,
    };
  }
  render() {
    return (
      <div className="postContainer">
        <div>
          <p>{this.state.title}</p>
          <p>{this.state.videoUrl}</p>
          <video width="320" height="240" controls>
            <source src={this.state.videoUrl} />
          </video>
        </div>
      </div>
    );
  }
}

export default Post;
