import { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";


const RenderTime = ({ remainingTime }) => {

  return (
    <div className="time-wrapper">
      <img style={{position: "absolute", top: "-3px", left: "15px", width:"150px",height:"150px"}} src="../../asset/cheers/cheersgif.gif"></img>
    </div>
  );
};

export {RenderTime};