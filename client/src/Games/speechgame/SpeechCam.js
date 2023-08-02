import React from "react";
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";

const SpeechCam = (props) => {
  const selectId = props.user.subscribers.find(
    (subscriber) => subscriber.stream.connection.connectionId === props.selectId
  );
  if (
    selectId &&
    (props.selectId ||
      selectId.stream.connection.connectionId ===
        props.user.streamManager.stream.connection.connectionId)
  ) {
    return (
      <>
        {/*========================여기까지================================*/}
        <OpenViduVideoComponent
          mode={"speechGameMain"}
          streamManager={selectId}
        />
      </>
    );
  } else {
    return (
      <>
        <OpenViduVideoComponent
          mode={"speechGameMain"}
          streamManager={props.user.streamManager}
        />
      </>
    );
  }
};

export default SpeechCam;
