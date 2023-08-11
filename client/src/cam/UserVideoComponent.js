import React, { Component } from "react";
import OpenViduVideoComponent from "./OpenViduVideoComponent";
import "./UserVideo.css";

const UserVideoComponent = (props) => {
  return (
      <>
        {props.streamManager !== undefined ? (
            <OpenViduVideoComponent
                mode={props.mode}
                cheers={props.cheers}
                streamManager={props.streamManager}
                index = {props.index}
                num = {props.num}
                myself = {props.myself}
                setVideoInfo={props.setVideoInfo}
            />
        ) : null}
      </>
  );
};
export default UserVideoComponent;
