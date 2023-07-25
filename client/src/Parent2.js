import React, { useState } from "react";
import ChatComponent from "./Chat/ChatComponent";
import EffectComponent from "./Chat/EffectComponent";
import Speechgame from "./Games/speechgame/speechgame";
import CamMain from "./cam/CamMain";
import OpenViduSession from "./cam/OpenViduSession";


const Parent2 = ({ roomName, idx }) => {
    const [sessionConnected, setSessionConnected] = useState(false);
    const [userStream, setUserStream] = useState(null);



    const handleSessionConnected = (localUser) => {
        setSessionConnected(true);
        setUserStream(localUser);
    };

    return (
        <div>
            <OpenViduSession onSessionConnect={handleSessionConnected} roomName={roomName} idx={idx} />

            {
                sessionConnected && userStream && (
                    <>
                        <CamMain user={userStream} sessionConnected={sessionConnected}/>
                        <ChatComponent user={userStream} sessionConnected={sessionConnected} />
                        <EffectComponent user={userStream} sessionConnected={sessionConnected}/>
                        <Speechgame user={userStream} sessionConnected={sessionConnected}/>
                    </>
                )
            }
        </div>
    );
};

export default Parent2;
