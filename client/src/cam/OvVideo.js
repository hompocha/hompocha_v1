import React, { useEffect, useRef, useState } from "react";
import { Results, Hands, HAND_CONNECTIONS, VERSION } from "@mediapipe/hands";
import {
  drawConnectors,
  drawLandmarks,
  Data,
  lerp,
} from "@mediapipe/drawing_utils";
import styles from "./OvVideo.module.css";
import { Camera } from "@mediapipe/camera_utils";

const OpenViduVideoComponent = (props) => {
  const [videoReady, setVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  //   console.log(props.state.mode);
  //   console.log(props.streamManager);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);

  useEffect(() => {
    // console.log(videoRef.current);
    if (videoRef.current && props.streamManager) {
      props.streamManager.addVideoElement(videoRef.current);
    }
  }, [props.streamManager]);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
    });
    // console.log(hands);
    const sendToMediaPipe = async () => {
      if (videoRef.current) {
        if (!videoRef.current.videoWidth) {
          console.log(videoRef.videoWidth);
          requestAnimationFrame(sendToMediaPipe);
        } else {
          console.log(videoRef);
          await hands.send({ image: videoRef.current });
          requestAnimationFrame(sendToMediaPipe);
        }
      }
    };

    if (videoRef.current && canvasRef.current) {
      canvasCtx.current = canvasRef.current.getContext("2d");
      console.log(`canvasCtx.current : ${canvasCtx.current}`);
      // setTimeout(sendToMediaPipe, 3000);

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, [videoReady]);

  const onResults = (results) => {
    if (canvasRef.current && canvasCtx.current) {
      setLoaded(true);
    }
    canvasCtx.current.save();
    canvasCtx.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasCtx.current.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        const classification = results.multiHandedness[index];
        const isRightHand = classification.label === "Right";
        const landmarks = results.multiHandLandmarks[index];
        drawConnectors(canvasCtx.current, landmarks, HAND_CONNECTIONS, {
          color: isRightHand ? "#00FF00" : "#FF0000",
        });
        drawLandmarks(canvasCtx.current, landmarks, {
          color: isRightHand ? "#00FF00" : "#FF0000",
          fillColor: isRightHand ? "#FF0000" : "#00FF00",
          radius: (data) => {
            return lerp(data.from.z, -0.15, 0.1, 10, 1);
          },
        });
      }
      canvasCtx.current.restore();
    }
  };

  return (
    <>
      {props.state.mode === undefined ? (
        <div>
          <span>대화모드</span>
          <video autoPlay={true} ref={videoRef} />
        </div>
      ) : null}

      {props.state.mode === "airHockey" ? (
        <div>
          <span>에어하키 모드</span>
          <video
            className={styles.videoCanvas}
            autoPlay={true}
            ref={(el) => {
              videoRef.current = el;
              setVideoReady(!!el);
            }}
          />
          <canvas
            className={styles.videoCanvas}
            ref={canvasRef}
            width={1200}
            height={720}
          />
        </div>
      ) : null}

      {props.state.mode === "movingDuck" ? (
        <div>
          <span>오리 옮기기 모드</span>
          <video autoPlay={true} ref={videoRef} />
          <canvas ref={canvasRef} width={700} height={600} />
        </div>
      ) : null}
    </>
  );
};

export default OpenViduVideoComponent;
