import React, { useEffect, useRef, useState } from "react";
import { Results, Hands, HAND_CONNECTIONS, VERSION } from "@mediapipe/hands";
import styles from "./OpenViduVideoComponent.module.css";
import { Camera } from "@mediapipe/camera_utils";
import { drawPaddle } from "../Games/AirHockey/drawPaddle";
import NewDrawBalls from "../Games/AirHockey/NewDrawBalls";

const OpenViduVideoComponent = (props) => {
  const [videoReady, setVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  console.log(props);
  console.log(typeof props.streamManager);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);
  const paddleRef = useRef(null);
  const paddleCtx = useRef(null);
  const canvasSubRef = useRef(null);
  const canvasSubCtx = useRef(null);
  const gameStateRef = useRef(null);
  const cheersRef = useRef(null);

  const streamId = props.streamManager.stream.connection.connectionId;

  useEffect(() => {
    const Interval = setInterval(() => {
      sendCheersSignal();
    }, 1000);

    return () => {
      clearInterval(Interval);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && props.streamManager) {
      props.streamManager.addVideoElement(videoRef.current);
    }
    if (streamId === props.myself) {
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

        /* onResults: hands가 하나의 프레임을 처리하고 나서 바로 실행될 함수 */
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
    }
  }, [videoReady]);

  const onResults = (results) => {
    if (canvasRef.current && canvasCtx.current) {
      setLoaded(true);
    }

    if (results.multiHandLandmarks && results.multiHandedness) {
      if (results.multiHandLandmarks[0] && results.multiHandLandmarks[0][8]) {
        cheersRef.current = results.multiHandLandmarks[0];
      }
    }
  };

  const sendCheersSignal = () => {
    if (props.streamManager.session) {
      const data = {
        hand: cheersRef.current,
      };
      props.streamManager.session
        .signal({
          data: JSON.stringify(data),
          to: [],
          type: "cheersData",
        })
        .then(() => {
          console.log("cheersData successfully sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    if (props.mode === "avoidGame") {
      canvasSubCtx.current = canvasSubRef.current.getContext("2d");
      const interval = setInterval(() => {
        gameStateRef.current =
          props.gameState[
            `${props.streamManager.stream.connection.connectionId}`
          ];
        if (gameStateRef.current !== undefined) {
          props.drawGame(
            canvasSubRef.current,
            canvasSubCtx.current,
            gameStateRef.current,
          );
        }
      }, 1000 / 20);
      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  useEffect(() => {
    if (props.mode === "somaek") {
      canvasSubCtx.current = canvasSubRef.current.getContext("2d");
      const interval = setInterval(() => {
        gameStateRef.current =
          props.gameState[
            `${props.streamManager.stream.connection.connectionId}`
          ];
        if (gameStateRef.current !== undefined) {
          props.drawGame(
            canvasSubRef.current,
            canvasSubCtx.current,
            gameStateRef.current,
          );
        }
      }, 1000 / 20);
      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  return (
    <>
      {
        /* 대화 모드일 때 불러와 지는 캠 */
        props.mode === undefined ? (
          <div>
            {/* <span>대화모드</span> */}
            <div className={styles.parent}>
              <video
                className={styles[`webcam${props.num}__${props.index}`]}
                autoPlay={true}
                ref={(el) => {
                  videoRef.current = el;
                  setVideoReady(!!el);
                }}
              />
              <canvas className={styles.videoCanvas} ref={canvasRef} />
            </div>
          </div>
        ) : null
      }

      {
        /* 하키게임할 때 플레이어 캠 */
        props.mode === "airHockey" ? (
          <>
            <video
              className={styles.videoCanvas}
              autoPlay={true}
              ref={(el) => {
                videoRef.current = el;
                setVideoReady(!!el);
              }}
            />
            <canvas className={styles.videoCanvas} ref={canvasRef} />
            <canvas className={styles.videoCanvas} ref={paddleRef} />
            <NewDrawBalls />
          </>
        ) : null
      }

      {
        /* 오리옮기기 게임할 때 불러와지는 플레이어 캠 */
        props.mode === "movingDuck" ? (
          <div>
            <span>오리 옮기기 모드</span>
            <video autoPlay={true} ref={videoRef} />
            <canvas ref={canvasRef} width={700} height={600} />
          </div>
        ) : null
      }
      {
        /* 룰렛돌리기할 때 불러와지는 플레이어 캠 */
        props.mode === "roulette" ? (
          <div>
            <video
              className={styles.rouletteVideo}
              autoPlay={true}
              ref={videoRef}
            />
          </div>
        ) : null
      }

      {
        /* 발음게임일 때 불러와 지는 캠 */
        props.mode === "centerCam" ? (
          <>
            <video
              className={styles.centerCam}
              autoPlay={true}
              ref={videoRef}
            />
          </>
        ) : null
      }
      {
        /* 발음게임일 때 불러와 지는 캠 */
        props.mode === "speechGame" ? (
          <>
            <video
              className={styles.speechGameSub}
              autoPlay={true}
              ref={videoRef}
            />
          </>
        ) : null
      }
      {
        /* 피하기 모드일 때 불러와 지는 캠 */
        props.mode === "avoidGame" ? (
          <>
            <video
              className={styles.avoidGameSub}
              autoPlay={true}
              ref={videoRef}
            />
            <canvas className={styles.avoidGameSubCan} ref={canvasSubRef} />
          </>
        ) : null
      }
      {
        /* 소맥게임 모드일 때 불러와 지는 캠 */
        props.mode === "somaek" ? (
          <>
            <video
              className={styles.somaekGameSub}
              autoPlay={true}
              ref={videoRef}
            />
            <canvas className={styles.somaekGameSubCan} ref={canvasSubRef} />
          </>
        ) : null
      }
    </>
  );
};

export default OpenViduVideoComponent;
