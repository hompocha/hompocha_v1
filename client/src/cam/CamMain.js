import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UseSpeechRecognition from "../voice/useSpeechRecognition";
import CamTest from "./CamTest";
import GameCam from "../Games/GameCam";
import styles from "../cam/CamMain.module.css";
import SpeechGame from "../Games/speechgame/SpeechGame";
import Somaek from "../Games/Somaek/Somaek";
import { AvoidGame } from "../Games/AvoidGame/AvoidGame";
import axios from "axios";
import Modal from "./Modal";
import { effectSound } from "../effectSound";
import pochaBGM from "../sounds/themeBGM/themePochaBGM.mp3";
import barBGM from "../sounds/themeBGM/themeBarBGM.mp3";
import izakayaBGM from "../sounds/themeBGM/themeIzakayaBGM.mp3";
import Loading from "../Loading/Loading";

const CamMain = ({ user, roomName, onModeChange, sessionConnected, idx , chatChangeOn, chatChangeOff }) => {
  const [mode, setMode] = useState(undefined);
  const navigate = useNavigate();
  const [conToNick] = useState({});
  const [micEnabled, setMicEnabled] = useState(true);
  const [speechBlocked, setSpeechBlocked] = useState(false);
  const [cheersReady, setCheersReady] = useState(false);
  const [cheersSuccess, setCheersSuccess] = useState(false);

  const [speechGamevoice, setspeechGamevoice] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [wheel, setWheel] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const [musicOn, setMusicOn] = useState(true);

  // 테마 변경을 위해 theme State 선언, 음성인시을 통한 테마 변경을 위해 theme과 setTheme을 useSpeechRecog...로 props 전달
  const [theme, setTheme] = useState(0);
  let bg_img;
  let bg_items;
  switch (theme) {
    case 0:
      bg_img = `${styles.themePocha}`;
      bg_items = `${styles.themePochaItem}`;
      break;
    case 1:
      bg_img = `${styles.themeBar}`;
      bg_items = `${styles.themeBarItem}`;
      break;
    case 2:
      bg_img = `${styles.themeIzakaya}`;
      bg_items = `${styles.themeIzakayaItem}`;
      break;
    default:
      break;
  }
  // 테마 변경에 따른 음악 변경
  useEffect(() => {
    let mainBGM;
    switch (theme) {
      case 0:
        if (mode === undefined) mainBGM = effectSound(pochaBGM, true, 0.1);
        if (musicOn === false) mainBGM.stop();
        break;
      case 1:
        if (mode === undefined) mainBGM = effectSound(barBGM, true, 0.1);
        if (musicOn === false) mainBGM.stop();
        break;
      case 2:
        if (mode === undefined) mainBGM = effectSound(izakayaBGM, true, 0.1);
        if (musicOn === false) mainBGM.stop();
        break;

      default:
        break;
    }
    return () => {
      if (mode === undefined) mainBGM.stop();
    };
  }, [theme, mode, musicOn]);

  /* 모드변경되면 음성인식 재시작 하도록 */
  useEffect(() => {
    setSpeechBlocked(false);
  }, [mode]);

  const canvasRef = useRef(null);
  const toggleMic = () => {
    setMicEnabled((prevState) => {
      const enabled = !prevState;
      const publisher = user.getStreamManager();
      if (enabled) {
        publisher.publishAudio(true);
      } else {
        publisher.publishAudio(false);
      }
      return enabled;
    });
  };

  useEffect(() => {
    console.log(theme);
    user.getStreamManager().stream.session.on("signal:nickName", (event) => {
      let nick = event.data;
      let conId = event.from.connectionId;

      // Only add the conId-nick pair if the conId is not already a key in the conToNick object
      if (!conToNick.hasOwnProperty(conId)) {
        conToNick[conId] = nick;
      }
      console.log("닉네임 리스트 ", conToNick);
    });

    user.getStreamManager().stream.session.on("signal:gameType", (event) => {
      const data = event.data;
      if (data === "airHockey") {
        enterAirHockey();
      } else if (data === "movingDuck") {
        enterMovingDuck();
      } else if (data === "speechGame") {
        try {
          axios.post(`${process.env.REACT_APP_API_URL}/room/status`, {
            status: "ingame",
            room_idx: idx,
          });
        } catch (error) {
          alert("재 로그인 해야합니다~!");
          navigate("/");
        }
        enterSpeech();
      } else if (data === "somaek") {
        try {
          axios.post(`${process.env.REACT_APP_API_URL}/room/status`, {
            status: "ingame",
            room_idx: idx,
          });
        } catch (error) {
          alert("재 로그인 해야합니다~!");
          navigate("/");
        }
        enterSomaek();
      } else if (data === "avoidGame") {
        try {
          axios.post(`${process.env.REACT_APP_API_URL}/room/status`, {
            status: "ingame",
            room_idx: idx,
          });
        } catch (error) {
          alert("재 로그인 해야합니다~!");
          navigate("/");
        }
        enterAvoidGame();
      } else {
        try {
          axios.post(`${process.env.REACT_APP_API_URL}/room/status`, {
            status: "openGame",
            room_idx: idx,
          });
        } catch (error) {
          alert("재 로그인 해야합니다~!");
          navigate("/");
        }
        enterMainRoom();
        /* data 가 undefined 일 경우 방으로 돌아감 */
        /* 음성인식 재시작 */
      }
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    setTimeout(() => {
      setLoaded(true);
    }, 3000);
  }, [canvasRef]);
  useEffect(() => {
    user
      .getStreamManager()
      .session.signal({
        data: user.getNickname(),
        to: [],
        type: "nickName",
      })
      .then(() => {
        console.log("Message successfully sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  const enterMainRoom = () => {
    setSpeechBlocked(true);
    setTimeout(() => {
      setMode(undefined);
      onModeChange(undefined);
      setTimeout(() => {
        setLoaded(true);
      }, 2000);
    }, 1500);
  };

  const enterAirHockey = () => {
    setSpeechBlocked(true);
    setMode("airHockey");
    onModeChange("airHockey");
  };

  const enterMovingDuck = () => {
    setMode("movingDuck");
    onModeChange("movingDuck");
  };

  const enterSpeech = () => {
    setSpeechBlocked(true);
    setTimeout(() => {
      setMode("speechGame");
      onModeChange("speechGame");
      setLoaded(false);
    }, 1500);
  };

  const enterSomaek = () => {
    setSpeechBlocked(true);
    setTimeout(() => {
      setMode("somaek");
      onModeChange("somaek");
      setLoaded(false);
    }, 1500);
  };

  const enterAvoidGame = () => {
    setSpeechBlocked(true);
    setTimeout(() => {
      setMode("avoidGame");
      onModeChange("avoidGame");
      setLoaded(false);
    }, 1500);
  };

  const sendEffectSignal = (string) => {
    if (user.getStreamManager().session) {
      user
        .getStreamManager()
        .session.signal({
          data: string,
          to: [],
          type: "effect",
        })
        .then(() => {
          console.log("Message successfully sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  function hubTospeechFromCamtest() {
    setWheel(true);
  }
  function hubForWheelFalse() {
    setWheel(false);
  }
  function offSpeechGame() {
    setspeechGamevoice(false);
  }
  function onSpeechGame() {
    setspeechGamevoice(true);
  }

  const sendGameTypeSignal = (string) => {
    if (user.getStreamManager().session) {
      user
        .getStreamManager()
        .session.signal({
          data: string,
          to: [],
          type: "gameType",
        })
        .then(() => {
          console.log("Message successfully sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const chooseHost = () => {
    const members = [];
    user.subscribers.forEach((subscriber) => {
      members.push(subscriber.stream.connection.connectionId);
    });
    members.push(user.streamManager.stream.connection.connectionId);
    const sortedMembers = [...members].sort();

    console.log("Host", sortedMembers[0]);
    console.log("List", members);
    console.log("sortedList :", sortedMembers);
    return sortedMembers[0];
  };

  const endSession = () => {
    if (user.getStreamManager().session) {
      user.getStreamManager().session.disconnect();
      try {
        const token = localStorage.getItem("jwtToken");
        axios.get(`${process.env.REACT_APP_API_URL}/room/roomout`, {
          headers: {
            Authorization: `Bearer ${token}`, // 요청 헤더에 토큰을 포함하여 서버에 전송
          },
        });
      } catch (error) {
        alert("토큰없음요");
        navigate("/lobby");
      }
    }
  };
  const handleClick = (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    console.log("마우스 클릭 좌표:", mouseX, mouseY);
  };

  useEffect(() => {
    // 페이지가 로드되면 마우스 클릭 이벤트 리스너를 추가합니다.
    document.addEventListener("click", handleClick);
    return () => {
      // 컴포넌트가 unmount될 때 이벤트 리스너를 제거합니다.
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const returnLobby = () => {
    setSpeechBlocked(true);
    setTimeout(() => {
      endSession();
      navigate("/lobby");
    }, 1500);
  };

  const sendCheersOnSignal = () => {
    user
      .getStreamManager()
      .session.signal({ to: [], type: "cheersOn" })
      .then(() => {
        // console.log("one more user is ready to drink");
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("sendCheersOnSignal 실행");
  };

  const sendCheersOffSignal = () => {
    user
      .getStreamManager()
      .session.signal({ to: [], type: "cheersOff" })
      .then(() => {
        // console.log("one more user is ready to drink");
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("sendCheersOffSignal 실행");
  };

  console.log("CamMain rendered");
  const micOnImageURL = "/Bell/micOn.png";
  const micOffImageURL = "/Bell/micOff.png";
  return (
    <div>
      <div className={bg_img}></div>
      {/* Main Room */}

      {mode === undefined && !loaded && (
        <div>
          <Loading mode={mode} />
        </div>
      )}
      {mode === undefined && (
        // <div id="session" className={styles.camMainWrap}>
        <div
          id="session"
          className={`${loaded ? styles.camMainWrap : ""} ${
            !loaded ? styles.hidden : ""
          }`}
        >
          {/*<div id="session" className={ !loaded ? styles.hidden : ''}>*/}

          {/* <div className={styles.bamboo}></div> */}
          <div id="session-header" className={styles.camMainHeader}>
            <h2 id="session-title">{roomName} </h2>
            <h2>{user.subscribers.length + 1}명 참여중</h2>
            <h2 className={styles.nickName}>{user.getNickname()}</h2>
            <button
              onClick={toggleMic}
              style={{
                backgroundImage: `url(${
                  micEnabled ? micOnImageURL : micOffImageURL
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                width: "57px", // Adjust the size as needed
                height: "57px", // Adjust the size as needed
                border: "none", // Remove border
                outline: "none", // Remove outline
                cursor: "pointer",
                backgroundColor: "transparent",
              }}
            />
            <button
              onClick={() => {
                if (musicOn === true) setMusicOn(false);
                if (musicOn === false) setMusicOn(true);
              }}
            >
              {musicOn?"음악끄기":"음악켜기"}
            </button>
            <form className={styles.ReturnRoom}>
              <input onClick={returnLobby} type="button" value="로비로 이동" />
            </form>
          </div>
          <div className={styles.gameListWrap}>
            <div></div>
            <div className={styles.gameMenu}>홈술포차 메 뉴 판</div>
            <div className={styles.gameButtons}>
              <div className={styles.eachGameMenu}>
                <div className={styles.gameName}>발 음 게 임</div>
                <button
                  onClick={() => sendGameTypeSignal("speechGame")}
                  style={{
                    backgroundImage: `url(/asset/room/playBtn.png)`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundColor: "transparent",
                    outline: "none",
                    border: "none",
                    width: "45px",
                    height: "45px",
                    cursor: "pointer",
                  }}
                />
              </div>
              <div>
                <div className={styles.gameName}>소 맥 게 임</div>
                <button
                  onClick={() => sendGameTypeSignal("somaek")}
                  style={{
                    backgroundImage: `url(/asset/room/playBtn.png)`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundColor: "transparent",
                    outline: "none",
                    border: "none",
                    width: "45px",
                    height: "45px",
                    cursor: "pointer",
                  }}
                />
              </div>
              <div>
                <div className={styles.gameName}>피하기게임</div>
                <button
                  className={styles.imgButton}
                  onClick={() => sendGameTypeSignal("avoidGame")}
                  style={{
                    backgroundImage: `url(/asset/room/playBtn.png)`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundColor: "transparent",
                    outline: "none",
                    border: "none",
                    width: "45px",
                    height: "45px",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
          <div className={bg_items} onClick={() => setModalOpen(true)}></div>
          <div className={styles.modalArrowText}>
            <div className={styles.modalArrow}></div>
            <div className={styles.modalText}>홈술포차 사용 설명서</div>
          </div>
          {modalOpen && <Modal setModalOpen={setModalOpen} />}
          <div className={styles.camAndVoice}>
            <UseSpeechRecognition
              sendEffectSignal={sendEffectSignal}
              sendGameTypeSignal={sendGameTypeSignal}
              speechBlocked={speechBlocked}
              sendCheersOnSignal={sendCheersOnSignal}
              sendCheersOffSignal={sendCheersOffSignal}
              theme={theme}
              setTheme={setTheme}
              hubTospeechFromCamtest={hubTospeechFromCamtest}
              chatChangeOn={chatChangeOn}
              chatChangeOff={chatChangeOff}
            />
            <CamTest
              user={user}
              wheel={wheel}
              hubForWheelFalse={hubForWheelFalse}
            />
          </div>

          <div>
            <canvas ref={canvasRef} width={1920} height={1080} />
          </div>
        </div>
      )}

      {/* 에어하키 모드 */}
      {mode === "airHockey" && (
        <div>
          <GameCam
            mode={mode}
            user={user}
            sessionConnected={sessionConnected}
          />
          <form className={styles.ReturnRoom}>
            <input
              onClick={() => sendGameTypeSignal(undefined)}
              type="button"
              value="방으로 이동"
            />
          </form>
        </div>
      )}

      {/* 오리 옮기기 모드 */}
      {mode === "movingDuck" && (
        <div>
          <GameCam
            mode={mode}
            user={user}
            sessionConnected={sessionConnected}
          />
          <form className={styles.ReturnRoom}>
            <input
              onClick={() => sendGameTypeSignal(undefined)}
              type="button"
              value="방으로 이동"
            />
          </form>
        </div>
      )}

      {/* 발음 게임 */}
      {mode === "speechGame" && (
        <div>
          <SpeechGame
            selectID={chooseHost()}
            user={user}
            end={sendGameTypeSignal}
            mode={mode}
            conToNick={conToNick}
            voice={speechGamevoice}
            voiceOn={onSpeechGame}
          />
          <form className={styles.ReturnRoom}>
            <input
              onClick={() => offSpeechGame()}
              type="button"
              value="방으로 이동"
            />
          </form>
        </div>
      )}
      {/*소맥게임*/}
      {mode === "somaek" && (
        <div>
          <Somaek
            selectId={chooseHost()}
            mode={mode}
            user={user}
            sessionConnected={sessionConnected}
            conToNick={conToNick}
            end={sendGameTypeSignal}
          />
          <form className={styles.ReturnRoom}>
            <input
              onClick={() => sendGameTypeSignal(undefined)}
              type="button"
              value="방으로 이동"
            />
          </form>
        </div>
      )}

      {/* 피하기 게임 */}
      {mode === "avoidGame" && (
        <div>
          <AvoidGame
            selectID={chooseHost()}
            user={user}
            end={sendGameTypeSignal}
            mode={mode}
            conToNick={conToNick}
          />
          <form className={styles.ReturnRoom}>
            <input
              onClick={() => sendGameTypeSignal(undefined)}
              type="button"
              value="방으로 이동"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default CamMain;
