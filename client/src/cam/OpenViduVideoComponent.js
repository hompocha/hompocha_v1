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
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);
  const paddleRef = useRef(null);
  const paddleCtx = useRef(null);

  const streamId = props.streamManager.stream.streamId;

  // useEffect(() => {
  //   if (videoRef.current && props.streamManager) {
  //     props.streamManager.addVideoElement(videoRef.current);
  //   }
  //   props.streamManager.stream.session.on('signal:hockeyData', (event) => {
  //     const data = JSON.parse(event.data);
  //     const {hand_x, hand_y} = data;
  //     paddleCtx.current = paddleRef.current.getContext("2d");
  //
  //     drawPaddle(hand_x, hand_y, paddleCtx, canvasRef);
  //     console.log('got Hockey Data');
  //   });
  //
  //   },[props.streamManager]);

  useEffect(() => {
    if (videoRef.current && props.streamManager) {
      props.streamManager.addVideoElement(videoRef.current);
    }

    const signalHandler = (event) => {
      const data = JSON.parse(event.data);

      const { hand_x, hand_y, connectionId } = data;

      if (connectionId !== streamId) {
        paddleCtx.current = paddleRef.current.getContext("2d");
        drawPaddle(hand_x, hand_y, paddleCtx, canvasRef);
        console.log("got Hockey Data from others");
      } else {
        console.log("got hockey from me ");
      }
    };

    props.streamManager.stream.session.on("signal:hockeyData", signalHandler);

    return () => {
      // Remove the event listener when the component is unmounted or props.streamManager changes
      props.streamManager.stream.session.off(
        "signal:hockeyData",
        signalHandler
      );
    };
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
  }, [videoReady]);

  const onResults = (results) => {
    if (canvasRef.current && canvasCtx.current) {
      setLoaded(true);
    }

    if (results.multiHandLandmarks && results.multiHandedness) {
      /* 패들 구현 */
      if (results.multiHandLandmarks[0] && results.multiHandLandmarks[0][8]) {
        paddleCtx.current = paddleRef.current.getContext("2d");
        const hand_x = results.multiHandLandmarks[0][8].x;
        const hand_y = results.multiHandLandmarks[0][8].y;
        drawPaddle(hand_x, hand_y, paddleCtx, canvasRef);
        // console.log(hand_x,hand_y);
        sendHockeyData(hand_x, hand_y);
      }
    }
  };

  /* 참고용  ------------*/
  // const sendMessage = () => {
  //   if (props.user && message){
  //     console.log(message);
  //     let messageStr = message.replace(/ + (?= )/g,'');
  //     if(messageStr !== '' && messageStr !== ' '){
  //       const data = { message: messageStr, streamId: props.user.getStreamManager().stream.streamId};
  //       props.user.getStreamManager().stream.session.signal({
  //         data: JSON.stringify(data),
  //         type: 'chat',
  //       });
  //     }
  //     setMessage('');
  //   }
  // }
  /*  -----------------------------  */
  const sendHockeyData = (hand_x, hand_y) => {
    props.streamManager.stream.session
      .signal({
        data: JSON.stringify({ hand_x, hand_y, streamId }),
        type: "hockeyData",
      })
      .then(() => {
        console.log("hockeyData successfully sent");
      });
  };

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
                ref={videoRef}
              />
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
            <video className={styles.rouletteVideo} autoPlay={true} ref={videoRef} />
          </div>
        ) : null
      }

      {
        /* 대화 모드일 때 불러와 지는 캠 */
        props.mode === "speechGame" ? (
          <div>
            {/* <span>대화모드</span> */}
            <div className={styles.parent}>
              <video
                autoPlay={true}
                ref={videoRef}
              />
            </div>
          </div>
        ) : null
      }
    </>
  );
};

export default OpenViduVideoComponent;
