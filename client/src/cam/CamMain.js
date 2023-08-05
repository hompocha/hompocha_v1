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

const CamMain = ({ user, roomName, onModeChange, sessionConnected, idx }) => {
  const [mode, setMode] = useState(undefined);
  const navigate = useNavigate();
  const [conToNick] = useState({});
  const [micEnabled, setMicEnabled] = useState(true);
  const [speechBlocked, setSpeechBlocked] = useState(false);
  const [cheersReady, setCheersReady] = useState(false);
  const [cheersSuccess, setCheersSuccess] = useState(false);

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
      console.log("sssssStream:", user.getStreamManager().stream); // 로그 출력
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
          navigate("/lobby");
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
          navigate("/lobby");
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
          navigate("/lobby");
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
          navigate("/lobby");
        }
        /* data 가 undefined 일 경우 방으로 돌아감 */
        enterMainRoom();
        /* 음성인식 재시작 */
        setSpeechBlocked(false);
      }

    });
  }, []);

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
    }, 1500);
  };

  const enterSomaek = () => {
    setSpeechBlocked(true);
    setTimeout(() => {
      setMode("somaek");
      onModeChange("somaek");
    }, 1500);
  };

  const enterAvoidGame = () => {
    setSpeechBlocked(true);
    setTimeout(() => {
      setMode("avoidGame");
      onModeChange("avoidGame");
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

  const handleCheersReady = () => {
    setCheersReady(true);
    console.log("건배모드로 변경되었음");
  };

  console.log("CamMain rendered");
  const micOnImageURL = "/Bell/micOn.png";
  const micOffImageURL = "/Bell/micOff.png";
  return (
    <div>
      <div className={bg_img}></div>
      {/* Main Room */}
      {mode === undefined && (
        <div id="session" className={styles.camMainWrap}>
          {/* <div className={styles.bamboo}></div> */}
          <div id="session-header" className={styles.camMainHeader}>
            <div id="session-title">{roomName} </div>
            <div>{user.subscribers.length + 1}명 참여중</div>
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
          <div className={bg_items}></div>
          <div className={styles.camAndVoice}>
            <UseSpeechRecognition
              sendEffectSignal={sendEffectSignal}
              sendGameTypeSignal={sendGameTypeSignal}
              speechBlocked={speechBlocked}
              handleCheersReady={handleCheersReady}
              theme={theme}
              setTheme={setTheme}
            />
            <CamTest user={user} />
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
