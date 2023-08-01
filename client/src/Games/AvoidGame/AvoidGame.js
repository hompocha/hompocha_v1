import { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Results, Hands, VERSION } from "@mediapipe/hands";
import styles from "./AvoidGame.module.css";
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";
import useSound from "../../useSound";
import BGM from "../../sounds/avoidBGM.mp3";

function newObj(src, width, height) {
  this.position = { x: 0, y: 0 };
  this.nextPosition = { x: 0, y: 0 };
  // this.image = new Image();
  // this.image.src = src;
  this.width = width;
  this.height = height;
  this.isAvoid = true;
}

/* 초기 게임 세팅*/
const defaultGameState = {
  roomId: "room",
  user: "connectionId",
  condition: {
    objSize: 0.01,
    objDropHeight: 0.08,
    ground: 0.98,
    objSpeed: 0.05,
    objIntervalFrame: 10,
    defaultTime: 1000 * 60,
  },
  hpBar: {
    hpLeft: 100,
    length: 0.8,
    height: 0.05,
    location: { x: 0.1, y: 0.02 },
  },
  player: {
    position: { x: 0.5, y: 0.95 },
    nextPosition: { x: 0.5, y: 0.95 },
    width: 0.05,
    height: 0.07,
    img: new Image(),
    img_src: undefined,
  },
  objects: [],
};

const AvoidGame = (props) => {
  const myConnectionId = props.user.connectionId;
  const [videoReady, setVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);
  const gameState = useRef(defaultGameState);
  const objInterval = useRef(null);
  const speedInterval = useRef(null);
  const sendInterval = useRef(null);
  const [gameEnd, setGameEnd] = useState(null);
  const hpLeft = useRef(100);

  const subscribers = props.user.subscribers;
  const subscriberState = {};

  /* 배경음악 */
  useSound(BGM, 1);

  /* 데이터 수신해서 반영 */
  useEffect(() => {
    if (props.user.getStreamManager().stream.session) {
      props.user
        .getStreamManager()
        .stream.session.on("signal:avoidgame_state", (event) => {
          const data = JSON.parse(event.data);
          console.log(subscribers[0]);
          subscriberState[`${data.currentGameState.user}`] =
            data.currentGameState;
          console.log(subscriberState);
        });
    }
  }, [props.user.getStreamManager().stream.session]);

  /* 비디오 시작 시 - 손 인식 시작 */
  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
      });

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

  /* 손 위치 인식 + 패들 위치 업데이트 + 패들 캔버스에 그림 */
  const onResults = (results) => {
    if (canvasRef.current && canvasCtx.current) {
      setLoaded(true);
    }

    /* 패들 위치 감지 */
    if (results.multiHandLandmarks && results.multiHandedness) {
      if (results.multiHandLandmarks[0] && results.multiHandLandmarks[0][8]) {
        let finger = results.multiHandLandmarks[0][8].x;
        if (finger > 0.98) {
          gameState.current.player.position.x = 0.98;
        } else if (finger < 0.02) {
          gameState.current.player.position.x = 0.02;
        } else {
          gameState.current.player.position.x = finger;
        }
      }
    }

    /* 공 및 패들 위치 업데이트 */
    updateGameState(canvasRef.current, gameState.current);
    /* 공 및 패들 캔버스에 그리기*/
    drawGame(canvasRef.current, canvasCtx.current, gameState.current);
  };

  /* 프레임마다 전송 */
  useEffect(() => {
    // console.log(props.user.connectionId, props.host);
    // if (props.user.connectionId === props.host ){
    //   console.log('I am the host!');
    // }
    gameState.current.user = props.user.connectionId;

    canvasCtx.current = canvasRef.current.getContext("2d");
    sendInterval.current = setInterval(() => {
      sendGameState(gameState.current);
    }, 1000 / 20);

    objInterval.current = setObjInterval(
      1000 / gameState.current.condition.objIntervalFrame
    );

    speedInterval.current = setInterval(() => {
      clearInterval(objInterval.current);
      gameState.current.condition.objIntervalFrame += 5;
      objInterval.current = setObjInterval(
        1000 / gameState.current.condition.objIntervalFrame
      );
    }, 7 * 1000);

    return () => {
      clearInterval(objInterval.current);
      clearInterval(speedInterval.current);
      clearInterval(sendInterval.current);
    };
  }, []);

  const setObjInterval = (time) => {
    return setInterval(() => {
      const obj = new newObj();
      if (Math.random() < 0.05) {
        obj.isAvoid = false;
      }
      obj.position.y = gameState.current.condition.objDropHeight;
      obj.position.x = Math.random();
      gameState.current.objects.push(obj);
    }, time);
  };

  const sendGameState = (currentGameState) => {
    if (props.user) {
      const stateToSend = JSON.stringify({ currentGameState });
      props.user
        .getStreamManager()
        .session.signal({
          data: stateToSend,
          to: [],
          type: "avoidgame_state",
        })
        .then(() => {
          console.log("Message successfully sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  /* 전체 게임을 그림 */
  const drawGame = (can_ref, can_ctx, gameState) => {
    const w = can_ref.width;
    const h = can_ref.height;
    can_ctx.save();
    can_ctx.clearRect(0, 0, w, h);
    drawPlayer(can_ref, can_ctx, gameState.player);

    gameState.objects.forEach((obj) => {
      drawObj(can_ref, can_ctx, obj);
    });

    drawHpBar(can_ref, can_ctx, gameState.hpBar.hpLeft);
    can_ctx.restore();
  };

  /* 플레이어를 그림 */
  const drawPlayer = (can_ref, can_ctx, player) => {
    const w = can_ref.width;
    const h = can_ref.height;
    can_ctx.fillStyle = "lime";
    can_ctx.fillRect(
      (player.position.x - player.width / 2) * w,
      (player.position.y - player.height / 2) * h,
      player.width * w,
      player.height * h
    );
  };

  /* 오브젝트 그림 */
  const drawObj = (can_ref, can_ctx, obj) => {
    const w = can_ref.width;
    const h = can_ref.height;

    can_ctx.beginPath();
    can_ctx.fillStyle = obj.isAvoid ? "red" : "green";
    can_ctx.arc(
      obj.position.x * w,
      obj.position.y * h,
      gameState.current.condition.objSize * w,
      0,
      2 * Math.PI
    );
    can_ctx.fill();
    can_ctx.closePath();
  };

  const drawHpBar = (can_ref, can_ctx, hp) => {
    const w = can_ref.width;
    const h = can_ref.height;
    can_ctx.fillStyle = hp > 30 ? "lime" : "yellow";
    can_ctx.fillRect(
      gameState.current.hpBar.location.x * w,
      gameState.current.hpBar.location.y * h,
      (hp / 100) * gameState.current.hpBar.length * w,
      gameState.current.hpBar.height * h
    );
  };

  /* 받은 데이터 기반으로 전체 게임 state 업데이트 */
  const updateGameState = (can_ref, gameState) => {
    const w = can_ref.width;
    const h = can_ref.height;

    /* obj 위치 업데이트 */
    for (let i = 0; i < gameState.objects.length; i++) {
      let obj = gameState.objects[i];
      if (
        obj.position.y + gameState.condition.objSpeed >
          gameState.player.position.y - gameState.player.height / 2 &&
        obj.position.x >
          gameState.player.position.x - gameState.player.width / 2 &&
        obj.position.x <
          gameState.player.position.x + gameState.player.width / 2
      ) {
        if (obj.isAvoid) {
          console.log(
            "diediediediediediediediediediediedie",
            gameState.hpBar.hpLeft.current
          );
          gameState.hpBar.hpLeft -= 3;
          if (gameState.hpBar.hpLeft < 0) {
            setGameEnd(true);
            gameState.objects = [];
            clearInterval(objInterval.current);
            clearInterval(speedInterval.current);
            clearInterval(sendInterval.current);
            gameState.hpBar.hpLeft = 100;
          }
        } else {
          console.log(
            obj.isAvoid,
            "yumyumyumyumyumyumyumyumyumyumyumyum",
            gameState.hpBar.hpLeft
          );
          gameState.hpBar.hpLeft += 5;
        }
        gameState.objects.splice(i, 1);
      }
      if (obj.position.y > gameState.condition.ground) {
        gameState.objects.splice(i, 1);
      }
      obj.position.y = obj.position.y + gameState.condition.objSpeed;
    }
  };

  return (
    <>
      {props.user.connectionId === props.host ? <h1>host</h1> : null}
      <video
        className={styles.avoidVideo}
        autoPlay={true}
        ref={(el) => {
          videoRef.current = el;
          setVideoReady(el);
        }}
      />
      <canvas className={styles.avoidCanvas} ref={canvasRef} />
      {/* subscribers Cam */}
      {subscribers.map((subscriber, index) => (
        <>
          <div className={styles[`avoidGameSub${index + 1}`]}>
            <OpenViduVideoComponent
              mode={"avoidGame"}
              streamManager={subscriber}
              drawGame={drawGame}
              gameState={subscriberState}
            />
          </div>
          <div className={styles[`userNick${index + 1}`]}>
            닉네임이 들어갈 자리
          </div>
        </>
      ))}
    </>
  );
};

export { AvoidGame };
