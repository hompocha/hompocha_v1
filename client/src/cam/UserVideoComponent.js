import React, { Component } from "react";
import OpenViduVideoComponent from "./OvVideo";
import "./UserVideo.css";

const UserVideoComponent = (props) => {
  return (
      <>
        {props.streamManager !== undefined ? (
            <OpenViduVideoComponent
                mode={props.mode}
                streamManager={props.streamManager}
            />
        ) : null}
      </>
  );
};
export default UserVideoComponent;
