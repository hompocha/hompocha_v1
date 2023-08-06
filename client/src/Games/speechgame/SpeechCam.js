import React from "react";
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";

const SpeechCam = (props) => {
  /* selectId가 내가 아닌 subscribers중에 있는지 없으면 undefined를 반환함*/
  const selectStreamManager = props.user.subscribers.find(
    (subscriber) =>
      subscriber.stream.connection.connectionId === props.selectId,
  );
  /* 나일경우에도 undefined반환함 */

  if (
    selectStreamManager &&
    (props.selectId ||
      selectStreamManager.stream.connection.connectionId ===
        props.user.streamManager.stream.connection.connectionId)
  )

  /*다른사람일경우*/
  {
    return (
      <>
        {/*========================여기까지================================*/}
        <OpenViduVideoComponent mode={"centerCam"} streamManager={selectStreamManager} />
      </>
    );
  }
  /*나일경우*/
  else {
    return (
      <>
        <OpenViduVideoComponent
          mode={"centerCam"}
          streamManager={props.user.streamManager}
        />
      </>
    );
  }
};

export default SpeechCam;
