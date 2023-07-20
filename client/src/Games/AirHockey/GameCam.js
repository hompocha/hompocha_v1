import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import drawHand from "./utilities";
import styles from "./GameCam.module.css";
import { GoalPostBlue, GoalPostRed } from "./GoalPost";
import DrawBalls from "./Ball";

function GameCam() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);

      requestAnimationFrame(() => detect(net)); // 다음 프레임 호출
    }
  };

  useEffect(() => {
    const runHandpose = async () => {
      const net = await handpose.load();
      console.log("Handpose model loaded.");
      detect(net); // 최초 한 번 호출
    };

    runHandpose();
  }, []);

  return (
    <div className="App">
      <Webcam className={styles.webcamRef} ref={webcamRef} />
      <canvas className={styles.webcamRef} ref={canvasRef} />
      <GoalPostRed />
      <GoalPostBlue />
      <DrawBalls />
    </div>
  );
}

export default GameCam;
