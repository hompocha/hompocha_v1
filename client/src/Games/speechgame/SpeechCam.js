import React from "react";
import OpenViduVideoComponent from "../../cam/OvVideo";

const SpeechCam = (props) => {
    const selectId = props.user.subscribers.find(
        (subscriber) => subscriber.stream.connection.connection === props.selectId
    )
    if (selectId && (!props.selectId || selectId.stream.connection.connectionId === props.user.streamManager.stream.connection.connectionId)){
    return (
        <>
                <OpenViduVideoComponent
                    mode ={undefined}
                    streamManager={selectId}
                />
        </>
    );}else{
        return(
        <>
            <OpenViduVideoComponent
                mode ={undefined}
                streamManager={props.user.streamManager}
            />
        </>
        )
    }
};

export default SpeechCam;