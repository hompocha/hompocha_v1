import React, { useState, useEffect } from "react";
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
  // let conToNick = {}; // Empty object, not an array

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
      if (data === "airHockey") {
        enterAirHockey();
      } else if (data === "movingDuck") {
        enterMovingDuck();
      } else if (data === "speechGame") {
        enterSpeech();
        try {
          axios.post(`${process.env.REACT_APP_API_URL}/room/status`, {
            status: "ingame",
            room_idx: idx,
          });
        } catch (error) {
          alert("재 로그인 해야합니다~!");
          navigate("/lobby");
        }
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
        /* data 가 undefined 일 경우 방으로 돌아감 */
        enterMainRoom();
      }
      if (mode === undefined) {
        try {
          axios.post(`${process.env.REACT_APP_API_URL}/room/status`, {
            status: "openGame",
            room_idx: idx,
          });
        } catch (error) {
          alert("재 로그인 해야합니다~!");
          navigate("/lobby");
        }
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
    setMode(undefined);
    onModeChange(undefined);
  };

  const enterAirHockey = () => {
    setMode("airHockey");
    onModeChange("airHockey");
  };

  const enterMovingDuck = () => {
    setMode("movingDuck");
    onModeChange("movingDuck");
  };

  const enterSpeech = () => {
    setMode("speechGame");
    onModeChange("speechGame");
  };

  const enterSomaek = () => {
    setMode("somaek");
    onModeChange("somaek");
  };

  const enterAvoidGame = () => {
    setMode("avoidGame");
    onModeChange("avoidGame");
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
        axios.get(`${process.env.REACT_APP_API_URL}/room/roomout`);
      } catch (error) {
        alert("토큰없음요");
        navigate("/lobby");
      }
    }
  };

  const returnLobby = () => {
    endSession();
    navigate("/Lobby");
  };

  console.log("CamMain rendered");

  return (
    <div>
      {/* Main Room */}
      {mode === undefined && (
        <div id="session" className={styles.camMainWrap}>
          <div id="session-header" className={styles.camMainHeader}>
            <div id="session-title">{roomName} </div>
            <div>{user.subscribers.length + 1}명 참여중</div>

            <form className={styles.ReturnRoom}>
              <input onClick={returnLobby} type="button" value="로비로 이동" />
            </form>
          </div>
          <div className={styles.gameListWrap}>
            <div className={styles.gameMenu}>메 뉴 판</div>
            <div className={styles.gameButtons}>
              {/* <button onClick={() => sendGameTypeSignal("airHockey")}>
                에어하키
              </button>
              <button onClick={() => sendGameTypeSignal("movingDuck")}>
                오리옮기기
              </button> */}
              <button onClick={() => sendGameTypeSignal("speechGame")}>
                발음게임
              </button>
              <button onClick={() => sendGameTypeSignal("somaek")}>
                소맥게임
              </button>
              <button onClick={() => sendGameTypeSignal("avoidGame")}>
                피하기게임
              </button>
            </div>
          </div>

          <div className={styles.camAndVoice}>
            <UseSpeechRecognition sendEffectSignal={sendEffectSignal} />
            <CamTest user={user} />
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
            mode={mode}
            user={user}
            sessionConnected={sessionConnected}
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
