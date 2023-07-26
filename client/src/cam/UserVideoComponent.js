import React, { Component } from "react";
import OpenViduVideoComponent from "./OpenViduVideoComponent";
import "./UserVideo.css";

const UserVideoComponent = (props) => {
  return (
      <>
        {props.streamManager !== undefined ? (
            <OpenViduVideoComponent
                mode={props.mode}
                streamManager={props.streamManager}
                index = {props.index}
                num = {props.num}
            />
        ) : null}
      </>
  );
};
export default UserVideoComponent;
