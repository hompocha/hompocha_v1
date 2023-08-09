import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UseSpeechRecognition from "../voice/useSpeechRecognition";
import CamTest from "./CamTest";
import styles from "../cam/CamMain.module.css";
import SpeechGame from "../Games/speechgame/SpeechGame";
import Somaek from "../Games/Somaek/Somaek";
import { AvoidGame } from "../Games/AvoidGame/AvoidGame";
import axios from "axios";
import Loading from "../Loading/Loading";
import { MicButton } from "./MicButton";
import Theme from "./Theme";
import FunctionContext from "../FunctionContext";


const CamMain = ({
  user,
  roomName,
  onModeChange,
  sessionConnected,
  idx,
  ovvSpeech,
}) => {
  const [mode, setMode] = useState(undefined);
  const navigate = useNavigate();
  const [conToNick] = useState({});
  const [speechBlocked, setSpeechBlocked] = useState(false);
  const [speechGamevoice, setspeechGamevoice] = useState(true);
  const [wheel, setWheel] = useState(false);
  const [loaded, setLoaded] = useState(false);

  /* 모드변경되면 음성인식 재시작 하도록 */
  useEffect(() => {
    if(speechBlocked)
      setSpeechBlocked(false);
  }, [mode]);

  const canvasRef = useRef(null);

  useEffect(() => {
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
      if (data === "speechGame") {
        try {
          axios.post(`${process.env.REACT_APP_API_URL}/room/status`, {
            status: "게임 중",
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
            status: "게임 중",
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
            status: "게임 중",
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
            status: "대화 중",
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
    if (mode === undefined) setWheel(true);
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
    // const mouseX = event.clientX;
    // const mouseY = event.clientY;
    // console.log("마우스 클릭 좌표:", mouseX, mouseY);
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
      .catch((error) => {
        console.log(error);
      });
    console.log("sendCheersOnSignal 실행");
  };

  const sendCheersOffSignal = () => {
    user
      .getStreamManager()
      .session.signal({ to: [], type: "cheersOff" })
      .catch((error) => {
        console.log(error);
      });

    console.log("sendCheersOffSignal 실행");
  };

  const sendThemeSignal = () => {
    user
      .getStreamManager()
      .session.signal({ to: [], type: "theme" })
      .then(() => {
        console.log("테마 변경 명령을 보냄 !!");
      });
    console.log("sendCheersOffSignal 실행");
  };

  /*마이크 토글 */
  const onMicToggle = (enabled) => {
    console.log(`마이크 ${enabled ? "켜짐" : "꺼짐"}`);
  };
  console.log("CamMain rendered");

  /* ====================== return ========================== */
  return (

    <div>
      <div className={styles.nickName}>{user.getNickname()}</div>
      {/* Main Room */}
      <Theme mode={mode} camMainLoaded={loaded} user={user} />
      {mode === undefined && !loaded && (
        <div>
          <Loading mode={mode} />
        </div>
      )}
      {mode === undefined && (
        <div
          id="session"
          className={`${loaded ? styles.camMainWrap : ""} ${
            !loaded ? styles.hidden : ""
          }`}
        >
          <div id="session-header" className={styles.camMainHeader}>
            <div id="session-title" className={styles.roomName}>
              {roomName}
            </div>
            <div className={styles.numOfUsers}>
              {user.subscribers.length + 1}명 참여중
            </div>
            <div className={styles.mic}>
              <div className={styles.micControl}>
                <MicButton onMicToggle={onMicToggle} user={user} />
              </div>
            </div>
            <div className={styles.toLobbyButton} onClick={returnLobby}></div>
          </div>
          <div className={styles.gameListWrap}>
            <div className={styles.gameMenu}>홈술포차 메 뉴 판</div>
            <div className={styles.gameButtons}>
              <div className={styles.eachGameMenu}>
                <div className={styles.gameName}>발 음 게 임</div>
                <div
                  onClick={() => sendGameTypeSignal("speechGame")}
                  className={styles.gameButton}
                ></div>
              </div>
              <div className={styles.eachGameMenu}>
                <div className={styles.gameName}>소 맥 게 임</div>
                <div
                  onClick={() => sendGameTypeSignal("somaek")}
                  className={styles.gameButton}
                ></div>
              </div>
              <div className={styles.eachGameMenu}>
                <div className={styles.gameName}>피하기게임</div>
                <div
                  onClick={() => sendGameTypeSignal("avoidGame")}
                  className={styles.gameButton}
                ></div>
              </div>
            </div>
          </div>

          <div className={styles.modalArrowText}>
            <div className={styles.modalArrow}></div>
            <div className={styles.modalText}>홈술포차 사용 설명서</div>
          </div>
          <div className={styles.camAndVoice}>
            <UseSpeechRecognition
              sendEffectSignal={sendEffectSignal}
              sendGameTypeSignal={sendGameTypeSignal}
              speechBlocked={speechBlocked}
              sendCheersOnSignal={sendCheersOnSignal}
              sendCheersOffSignal={sendCheersOffSignal}
              sendThemeSignal={sendThemeSignal}
              hubTospeechFromCamtest={hubTospeechFromCamtest}
              user={user}
              ovvSpeech ={ovvSpeech}
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
          <div
            onClick={() => offSpeechGame()}
            className={styles.toRoomButton}
          ></div>
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
          <div
            onClick={() => sendGameTypeSignal(undefined)}
            className={styles.toRoomButton}
          ></div>
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
          <div
            onClick={() => sendGameTypeSignal(undefined)}
            className={styles.toRoomButton}
          ></div>
        </div>
      )}
    </div>
  );
};

export default CamMain;
