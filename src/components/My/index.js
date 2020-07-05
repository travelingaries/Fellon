import React, { Component } from "react";
import ReactModal from "react-modal";
import TabBar from "../TabBar";
import NavBar from "../NavBar";

import "./My.css";

class My extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 5,
      showModal: false,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div className="regular-index">
        <NavBar
          currentTab={this.state.currentTab}
          handleOpenModal={this.handleOpenModal}
          handleCloseModal={this.handleCloseModal}
          showModal={this.state.showModal}
        />
        <div className="container">
          <ReactModal
            isOpen={this.state.showModal}
            contentLabel="Settings"
            onRequestClose={this.handleCloseModal}
            className="settingsModal"
            overlayClassName="settingsOverlay"
            ariaHideApp="false"
            style={{ overlay: { background: "#a0a0a0" } }}
          >
            <div className="settingsModalContent">
              <div>
                <h4>Hasdfasdf</h4>
              </div>
            </div>
          </ReactModal>
          <div
            className="myTabBody"
            style={{ display: this.state.showModal ? "none" : "block" }}
          >
            <div className="nothingHere">
              <h4 style={{ fontSize: "20px", textAlign: "center" }}>
                업로드한 영상이 없네요
              </h4>
              <p>
                하단 업로드 버튼을 눌러 펠롱들에게
                <br />
                관심사와 매력을 어필해보세요.
              </p>
            </div>
          </div>
        </div>
        <TabBar currentTab={this.state.currentTab} />
      </div>
    );
  }
}

export default My;
