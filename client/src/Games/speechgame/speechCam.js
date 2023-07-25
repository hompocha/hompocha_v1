import React from "react";
import OpenViduVideoComponent from "../../cam/OvVideo";

const SpeechCam = (props) => {
    return (
        <>
            {props.subscribers.map((subscriber) => (
                <OpenViduVideoComponent
                    key={subscriber.stream.streamId} // Make sure to provide a unique key
                    state={props}
                    streamManager={subscriber}
                />
            ))}
        </>
    );
};

export default SpeechCam;
