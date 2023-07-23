import React, { Component } from "react";
import OpenViduVideoComponent from "./OvVideo";
import "./UserVideo.css";

export default class UserVideoComponent extends Component {
  render() {
    return (
      <>
        {this.props.streamManager !== undefined ? (
          <OpenViduVideoComponent
            state={this.props}
            streamManager={this.props.streamManager}
          />
        ) : null}
      </>
    );
  }
}
