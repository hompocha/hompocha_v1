import React, { useState } from "react";
import ChatComponent from "./Chat/ChatComponent";
import EffectComponent from "./Chat/EffectComponent";
import CamMain from "./cam/CamMain";
import OpenViduSession from "./cam/OpenViduSession";
import styles from "./Parent2.module.css";
import FunctionContext from "./FunctionContext";

const Parent2 = ({ roomName, idx }) => {
  const [sessionConnected, setSessionConnected] = useState(false);
  const [userStream, setUserStream] = useState(null);
  const [mode, setMode] = useState(undefined);
  const [chatToggle,setChatToggle] = useState(false);
  const [speech, setSpeech]= useState(true);

  const ovvSpeechOff = ()=>{
    setSpeech(false);
  }
  
  const onModeChange = (newMode) => {
    setMode(newMode);
    console.log("parent mode = ", newMode, mode);
  };
  const fnFromChat = () => {
    console.log("chat에 있는 함수, 딴데서 부름!!");
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
        ovvSpeechOff={ovvSpeechOff}
      />
      {sessionConnected && userStream && (
        <>
          <div className={styles.camChatWrap}>
            <FunctionContext.Provider value={fnFromChat}>
              <div className={styles.zindex1}>
                <CamMain
                  user={userStream}
                  sessionConnected={sessionConnected}
                  setUserStream={setUserStream}
                  onModeChange={onModeChange}
                  roomName={roomName}
                  idx={idx}
                  ovvSpeech = {speech}
                />
              </div>
              <div className={styles.zindex}>
                <ChatComponent
                  user={userStream}
                  sessionConnected={sessionConnected}
                  roomName={roomName}
                  chatToggle={chatToggle}
                  setChatToggle={setChatToggle}
                />

              </div>
            </FunctionContext.Provider>
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
