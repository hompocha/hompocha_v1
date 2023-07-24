import React, { useEffect, useRef, useState } from "react";
import { Results, Hands, HAND_CONNECTIONS, VERSION } from "@mediapipe/hands";
import styles from "./OvVideo.module.css";
import { Camera } from "@mediapipe/camera_utils";
import { drawPaddle } from "../Games/AirHockey/drawPaddle";
import NewDrawBalls from "../Games/AirHockey/NewDrawBalls";

const OpenViduVideoComponent = (props) => {
  const [videoReady, setVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);
  const paddleRef = useRef(null);
  const paddleCtx = useRef(null);

  useEffect(() => {
    if (videoRef.current && props.streamManager) {
      props.streamManager.addVideoElement(videoRef.current);
    }
  }, [props.streamManager]);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
    });

    if (videoRef.current && canvasRef.current) {
      canvasCtx.current = canvasRef.current.getContext("2d");

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
        width: 960,
        height: 720,
      });
      camera.start();
    }
  }, [videoReady]);

  const onResults = (results) => {
    if (canvasRef.current && canvasCtx.current) {
      setLoaded(true);
    }

    if (results.multiHandLandmarks && results.multiHandedness) {
      /* 패들 구현 */
      if (results.multiHandLandmarks[0] && results.multiHandLandmarks[0][8]) {
        paddleCtx.current = paddleRef.current.getContext("2d");
        const x_value = results.multiHandLandmarks[0][8].x;
        const y_value = results.multiHandLandmarks[0][8].y;
        drawPaddle(x_value, y_value, paddleCtx, canvasRef);
      }
    }
  };

  return (
    <>
      {
        /* 대화 모드일 때 불러와 지는 캠 */
        props.state.mode === undefined ? (
          <div>
            <span>대화모드</span>
            <video autoPlay={true} ref={videoRef} />
          </div>
        ) : null
      }

      {
        /* 하키게임할 때 플레이어 캠 */
        props.state.mode === "airHockey" ? (
          <>
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
              width={960}
              height={720}
            />
            <canvas
              className={styles.videoCanvas}
              ref={paddleRef}
              width={960}
              height={720}
            />
            <NewDrawBalls />
          </>
        ) : null
      }

      {
        /* 오리옮기기 게임할 때 불러와지는 플레이어 캠 */
        props.state.mode === "movingDuck" ? (
          <div>
            <span>오리 옮기기 모드</span>
            <video autoPlay={true} ref={videoRef} />
            <canvas ref={canvasRef} width={700} height={600} />
          </div>
        ) : null
      }

      {/* 게임화면에서 다른 유저의 캠 */}
    </>
  );
};

export default OpenViduVideoComponent;
