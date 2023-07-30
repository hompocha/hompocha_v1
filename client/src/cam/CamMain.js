import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UseSpeechRecognition from "../voice/useSpeechRecognition";
import CamTest from "./CamTest";
import GameCam from "../Games/GameCam";
import styles from "../cam/CamMain.module.css";
import SpeechGame from "../Games/speechgame/SpeechGame";
import Somaek from "../Games/Somaek/Somaek";
import { AvoidGame } from "../Games/AvoidGame/AvoidGame";

const CamMain = ({ user, roomName, onModeChange, sessionConnected }) => {
  const [mode, setMode] = useState(undefined);
  const navigate = useNavigate();
  const [childStopped, setChildStopped] = useState(false);

  useEffect(() => {
    user.getStreamManager().stream.session.on("signal:gameType", (event) => {
      const data = event.data;
      if (data === "airHockey") {
        enterAirHockey();
      } else if (data === "movingDuck") {
        enterMovingDuck();
      } else if (data === "speechGame") {
        enterSpeech();
      } else if (data === "somaek"){
        enterSomaek();
      } else if (data === "avoidGame") {
        enterAvoidGame();
      }
      /* data 가 undefined 일 경우 방으로 돌아감 */
      else {
        enterMainRoom();
      }
    });
  }, []);

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

  const enterSomaek = () =>{
    setMode("somaek");
    onModeChange("somaek");
  }

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
            <h1 id="session-title">{roomName} </h1>
            <h2>{user.subscribers.length + 1}명 참여중</h2>
            <input
              onClick={() => sendGameTypeSignal("airHockey")}
              type="button"
              value="에어하키"
            />
            <input
              onClick={() => sendGameTypeSignal("movingDuck")}
              type="button"
              value="오리옮기기"
            />
            <input
              onClick={() => sendGameTypeSignal("speechGame")}
              type="button"
              value="발음게임"
            />
            <input
              onClick={() => sendGameTypeSignal("somaek")}
              type="button"
              value="소맥게임"
            />

            <input
              onClick={() => sendGameTypeSignal("avoidGame")}
              type="button"
              value="피하기게임"
            />

            <form className={styles.ReturnRoom}>
              <input onClick={returnLobby} type="button" value="로비로 이동" />
            </form>
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
