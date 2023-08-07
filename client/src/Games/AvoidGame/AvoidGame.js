import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Results, Hands, VERSION } from "@mediapipe/hands";
import styles from "./AvoidGame.module.css";
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";
import useSound from "../../useSound";
import BGM from "../../sounds/avoidBGM.mp3";
import Loading from "../../Loading/Loading";
import LoserCam from "../loserCam/LoserCam";
import hitEffect from "../../sounds/avoid_effect2.wav";
import healEffect from "../../sounds/heal1.wav";
import { effectSound } from "../../effectSound";
import CountDown from "../../Loading/CountDown";

function newObj(src, width, height) {
  this.position = { x: 0, y: 0 };
  this.nextPosition = { x: 0, y: 0 };
  this.width = width;
  this.height = height;
  this.isAvoid = true;
  this.type = undefined;
}

/* 초기 게임 세팅*/
const defaultGameState = {
  roomId: "room",
  user: "connectionId",
  condition: {
    objSize: 0.15,
    objLenX: 0.15,
    objLenY: 0.15,
    objDropHeight: 0.08,
    ground: 0.92,
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
    width: 0.06,
    height: 0.135,
    state: 0,
  },
  objects: [],
};

const images = {
  soju: "../../asset/game_img/soju.png",
  beer: "../../asset/game_img/beer.png",
  avoid_pill: "../../asset/game_img/avoid_pill.png",
  player_normal: "../../asset/game_img/normal.png",
  player_sick: "../../asset/game_img/sick.png",
};

/*======================================================= */
/*=================== 메인 함수 시작=================== */
/*======================================================= */

const AvoidGame = (props) => {
  const myConnectionId = props.user.connectionId;
  const [videoReady, setVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [countDown, setCountDown] = useState(false);
  const [start, setStart] = useState(false);
  const [lowestConId, setLowestConId] = useState(undefined);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);
  const gameState = useRef(defaultGameState);
  const objInterval = useRef(null);
  const speedInterval = useRef(null);
  const sendInterval = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const hpLeft = useRef(100);
  const hostId = props.selectID;

  const subscribers = props.user.subscribers;
  const subscriberState = {};
  const imgElements = [];
  const result = [];

  // /* 배경음악 */
  // useSound(BGM, 0.7);

  /*======================================================= */
  /*=================== 게임 시작=================== */
  /*======================================================= */

  /* 프레임마다 전송 */
  useEffect(() => {
    if (!start) return;
    const avoidBGM = effectSound(BGM, true, 0.7);

    gameState.current.user = props.user.connectionId;
    if (isGameOver) {
      avoidBGM.stop();
      return;
    }

    if (canvasRef.current) {
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
    }

    return () => {
      clearInterval(objInterval.current);
      clearInterval(speedInterval.current);
      clearInterval(sendInterval.current);
      avoidBGM.stop();
    };
  }, [start, isGameOver]);

  /*======================================================= */
  /*===================손 인식 및 게임 화면 그리기=================== */
  /*======================================================= */

  useEffect(() => {
    const handleLoaded = () => {
      if (videoRef.current && canvasRef.current) {
        setTimeout(() => {
          console.log("ready");
          setLoaded(true);
          sendReadySignal();
        }, 3000);
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", handleLoaded);
    }
    if (canvasRef.current) {
      handleLoaded();
    }
  }, [videoRef.current, canvasRef.current]);

  /* 비디오 시작 시 - 손 인식 시작 */
  useEffect(() => {
    let didCancel = false;

    const loadHandsAndCamera = async () => {
      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
      });
      let camera;

      if (videoRef.current && canvasRef.current) {
        canvasCtx.current = canvasRef.current.getContext("2d");

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults(onResults);

        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (!didCancel) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 960,
          height: 720,
        });

        camera.start();
      }

      return () => {
        if (camera) {
          camera.stop();
        }
      };
    };

    loadHandsAndCamera();

    return () => {
      didCancel = true;
    };
  }, [videoReady, canvasRef.current]);

  /* 손 위치 인식 + 패들 위치 업데이트 + 패들 캔버스에 그림 */
  const onResults = (results) => {
    /* 패들 위치 감지 */
    if (results.multiHandLandmarks && results.multiHandedness) {
      if (results.multiHandLandmarks[0] && results.multiHandLandmarks[0][8]) {
        let finger = results.multiHandLandmarks[0][8].x;
        if (finger > 0.98) {
          gameState.current.player.position.x = 0.95;
        } else if (finger < 0.02) {
          gameState.current.player.position.x = 0.05;
        } else {
          gameState.current.player.position.x = finger;
        }
      }
    }

    /* 공 및 패들 위치 업데이트 */
    updateGameState(canvasRef.current, gameState.current);
    /* 공 및 패들 캔버스에 그리기*/
    loadImages(canvasRef.current, canvasCtx.current, gameState.current);
  };

  const setObjInterval = (time) => {
    return setInterval(() => {
      const obj = new newObj();
      if (Math.random() < 0.05) {
        obj.type = "avoid_pill";
      } else if (Math.random() < 0.5) {
        obj.type = "soju";
      } else {
        obj.type = "beer";
      }
      obj.position.y = gameState.current.condition.objDropHeight;
      obj.position.x = Math.random() * 1.3 - 0.15; // 가장자리 사각지대 방지
      gameState.current.objects.push(obj);
    }, time);
  };

  /* 이미지 로드 후 게임 그리기 */
  const loadImages = async (can_ref, can_ctx, gameState) => {
    try {
      for (let type in images) {
        const img = new Image();
        img.src = images[type];
        // 이미지 로딩을 Promise로 감싸 비동기로 처리
        await new Promise((resolve) => {
          img.onload = () => resolve();
        });
        imgElements[type] = img;
      }
      // 모든 이미지 로딩이 완료되면 애니메이션 시작
      drawGame(can_ref, can_ctx, gameState);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  /* 전체 게임을 그림 */
  const drawGame = async (can_ref, can_ctx, gameState) => {
    const w = can_ref.width;
    const h = can_ref.height;
    can_ctx.save();
    can_ctx.clearRect(0, 0, w, h);
    drawPlayer(can_ref, can_ctx, gameState.player);
    gameState.objects.forEach((obj) => {
      drawObj(can_ref, can_ctx, obj);
    });

    if (gameState.player.state > 0) {
      const grad = can_ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0.4, "rgba(0, 0, 0, 0)");
      grad.addColorStop(0, "rgba(255, 0, 0, 0.6)");
      can_ctx.fillStyle = grad;
      can_ctx.fillRect(0, 0, w, h);
    }

    drawHpBar(can_ref, can_ctx, gameState.hpBar.hpLeft);

    can_ctx.restore();
  };

  /* 플레이어를 그림 */
  const drawPlayer = (can_ref, can_ctx, player) => {
    const w = can_ref.width;
    const h = can_ref.height;

    const img =
      player.state < 1
        ? imgElements["player_normal"]
        : imgElements["player_sick"];
    can_ctx.drawImage(
      img,
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

    const img = imgElements[obj.type];
    can_ctx.drawImage(
      img,
      obj.position.x * w,
      obj.position.y * h,
      gameState.current.condition.objLenX * w,
      gameState.current.condition.objLenY * h
    );
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
        obj.position.y +
          gameState.condition.objLenY / 2 +
          gameState.condition.objSpeed >
          gameState.player.position.y - gameState.player.height / 2 &&
        obj.position.x + gameState.condition.objLenX / 2 >
          gameState.player.position.x - gameState.player.width / 2 &&
        obj.position.x + gameState.condition.objLenX / 2 <
          gameState.player.position.x + gameState.player.width / 2
      ) {
        if (obj.type !== "avoid_pill") {
          effectSound(hitEffect);
          console.log(
            "diediediediediediediediediediediedie",
            gameState.hpBar.hpLeft.current
          );
          gameState.hpBar.hpLeft -= 10;
          gameState.player.state += 1;
          setTimeout(() => {
            gameState.player.state -= 1;
          }, 200);

          if (gameState.hpBar.hpLeft < 0) {
            gameState.objects = [];
            gameState.hpBar.hpLeft = 100;
            clearInterval(speedInterval.current);
            clearInterval(objInterval.current);
            clearInterval(sendInterval.current);
            sendGameResult();
          }
        } else {
          console.log(
            obj.isAvoid,
            "yumyumyumyumyumyumyumyumyumyumyumyum",
            gameState.hpBar.hpLeft
          );
          gameState.hpBar.hpLeft += 5;
          effectSound(healEffect);
        }
        gameState.objects.splice(i, 1);
      }
      obj.position.y = obj.position.y + gameState.condition.objSpeed;
      if (obj.position.y > gameState.condition.ground) {
        gameState.objects.splice(i, 1);
      }
    }
  };

  /*======================================================= */
  /*===================시그널 관련=================== */
  /*======================================================= */

  /* 데이터 수신해서 반영 */
  useEffect(() => {
    if (props.user.getStreamManager().stream.session) {
      props.user
        .getStreamManager()
        .stream.session.on("signal:avoidgame_state", (event) => {
          const data = JSON.parse(event.data);
          subscriberState[`${data.currentGameState.user}`] =
            data.currentGameState;
        });

      props.user
        .getStreamManager()
        .stream.session.on("signal:avoidgame_result", (event) => {
          const data = JSON.parse(event.data);
          result.push(data.user);
          console.log(result.length, subscribers.length);
          if (result.length >= subscribers.length + 1) {
            console.log(result[0]);
            setLowestConId(result[0]);
            setIsGameOver(true);
          }
        });

      /* start 시그널 받는 session on !! */
      props.user
        .getStreamManager()
        .stream.session.on("signal:startSignal", (event) => {
          setCountDown(true);
          /* 3초후에 스타트로 바뀜!*/
          setTimeout(() => {
            setCountDown(false);
            setTimeout(() => {
              setStart(true);
            }, 300);
          }, 3000);
        });

      /* 내가 호스트일 경우에만, session on 함  */
      if (
        props.user.getStreamManager().stream.connection.connectionId === hostId
      ) {
        let readyPeople = [];
        props.user
          .getStreamManager()
          .stream.session.on("signal:readySignal", (event) => {
            let fromId = event.from.connectionId;
            if (!readyPeople.includes(fromId)) {
              readyPeople.push(fromId);
              console.log(readyPeople);
            }

            if (readyPeople.length === subscribers.length + 1) {
              console.log("받았다!!!");
              sendStartSignal();
              props.user
                .getStreamManager()
                .stream.session.off("signal:readySignal");
            }
          });
      }
    }
  }, [props.user.getStreamManager().stream.session]);

  /* 게임 로딩 후 레디 시 전송 */
  const sendReadySignal = () => {
    props.user
      .getStreamManager()
      .session.signal({
        to: [],
        type: "readySignal",
      })
      .then(() => {
        console.log("readySignal successfully sent");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /* 게임 시작 시그널 전송 */
  const sendStartSignal = () => {
    props.user
      .getStreamManager()
      .session.signal({
        to: [],
        type: "startSignal",
      })
      .then(() => {
        console.log("startSignal successfully sent");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /* 게임 진행 상태 전송 */
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

  /* 게임 결과 전송 */
  const sendGameResult = () => {
    if (props.user) {
      const Id = JSON.stringify({ user: myConnectionId });
      props.user
        .getStreamManager()
        .session.signal({
          data: Id,
          to: [],
          type: "avoidgame_result",
        })
        .then(() => {
          console.log("Message successfully sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  /*======================================================= */
  /*=================== return =================== */
  /*======================================================= */

  return (
    <>
      {props.mode === "avoidGame" && !loaded && (
        <div>
          <Loading mode={props.mode} />
        </div>
      )}
      {props.user.connectionId === props.host ? <h1>host</h1> : null}
      {props.mode === "avoidGame" && countDown && (
        <div>
          <CountDown />
        </div>
      )}
      {props.mode === "avoidGame" && !isGameOver ? (
        <>
          <div className={styles.mainUserCamBorder}></div>
          <video
            className={`${styles.avoidVideo} ${!loaded && styles.hidden}`}
            // className={styles.avoidVideo}
            autoPlay={true}
            ref={(el) => {
              videoRef.current = el;
              setVideoReady(el);
            }}
          />
          <canvas
            className={`${styles.avoidCanvas} ${!start && styles.hidden}`}
            ref={canvasRef}
            width={"960px"}
            height={"720px"}
          />
          {/* subscribers Cam */}
          {subscribers.map((subscriber, index) => (
            <>
              
              <div className={`${styles[`gameSubBorder${index + 1}`]}`}></div>
              <div
                className={`${styles[`avoidGameSub${index + 1}`]} ${
                  !loaded && styles.hidden
                }`}
              >
                <OpenViduVideoComponent
                  mode={"avoidGame"}
                  streamManager={subscriber}
                  drawGame={loadImages}
                  gameState={subscriberState}
                />
              </div>
              <div
                className={`${styles[`userNick${index + 1}`]} ${
                  !loaded && styles.hidden
                }`}
              >
                {/* 닉네임이 들어갈 자리 */}
                {props.conToNick[subscriber.stream.connection.connectionId]}
              </div>
            </>
          ))}
        </>
      ) : (
        <>
          <div className={styles.mainUserCamBorder}></div>
          <LoserCam
            selectId={lowestConId}
            user={props.user}
            mode={"centerCam"}
            end={props.end}
            conToNick={props.conToNick}
          />
        </>
      )}
      ;
    </>
  );
};

export { AvoidGame };
