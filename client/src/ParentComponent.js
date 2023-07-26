import React, { useState } from "react";
import ChatComponent from "./Chat/ChatComponent";
import CamFour from "./cam/CamFour";
import EffectComponent from "./Chat/EffectComponent";
import SpeechGame from "./Games/speechgame/SpeechGame";


const ParentComponent = ({ roomName, idx }) => {
    const [sessionConnected, setSessionConnected] = useState(false);
    const [camFourStream, setCamFourStream] = useState(null);

    const handleSessionConnected = (localUser) => {
        setSessionConnected(true);
        setCamFourStream(localUser);
    };

    return (
        <div>
            <CamFour onSessionConnect={handleSessionConnected} roomName={roomName} idx={idx} />
            {
                sessionConnected && camFourStream && (
                    <>
                        <ChatComponent user={camFourStream} sessionConnected={sessionConnected} />
                        <EffectComponent user={camFourStream} sessionConnected={sessionConnected}/>
                        <SpeechGame user={camFourStream} sessionConnected={sessionConnected}/>
                    </>
                )
            }
        </div>
    );
};

export default ParentComponent;
