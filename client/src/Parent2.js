import React, { useState } from "react";
import ChatComponent from "./Chat/ChatComponent";
import EffectComponent from "./Chat/EffectComponent";
import CamMain from "./cam/CamMain";
import OpenViduSession from "./cam/OpenViduSession";
import UserModel from "./models/user-model";
import styles from "./Parent2.module.css";

const Parent2 = ({ roomName, idx }) => {
  const [sessionConnected, setSessionConnected] = useState(false);
  const [userStream, setUserStream] = useState(null);
  const [mode, setMode] = useState(undefined);

  const onModeChange = (newMode) => {
    setMode(newMode);
    console.log("parent mode = ", newMode, mode);
  };

  const handleSessionConnected = (localUser) => {
    setSessionConnected(true);
    setUserStream(localUser);
  };

  return (
    <div className={styles.roomWrap}>
      {/* 세션연결을 위한 컴포넌트 보이는 부분 없음 */}
      <OpenViduSession
        onSessionConnect={handleSessionConnected}
        setUserStream={setUserStream}
        roomName={roomName}
        idx={idx}
      />
      {sessionConnected && userStream && (
        <>
          <div className={styles.camChatWrap}>
            <div className={styles.zindex1}>
              <CamMain
                user={userStream}
                sessionConnected={sessionConnected}
                setUserStream={setUserStream}
                onModeChange={onModeChange}
                roomName={roomName}
              />
            </div>
            <div className={styles.zindex}>
              <ChatComponent
                user={userStream}
                sessionConnected={sessionConnected}
                roomName={roomName}
              />

            </div>
          </div>
          <div className={styles.effectWrap}>
            <EffectComponent
              user={userStream}
              sessionConnected={sessionConnected}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Parent2;
