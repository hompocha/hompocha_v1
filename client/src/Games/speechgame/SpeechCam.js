import React from "react";
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";

const SpeechCam = (props) => {
    const selectId = props.user.subscribers.find(
        (subscriber) => subscriber.stream.connection.connectionId=== props.selectId
    )
    console.log("받은 conntionid에서 찾은 streamManger :", selectId);
    if (selectId && (props.selectId || selectId.stream.connection.connectionId === props.user.streamManager.stream.connection.connectionId))
    {
        return (
          <>
              {/*========================테스트입니다=============================*/}
              <h1>애는 조건문을 통과한애{selectId.stream.connection.connectionId}</h1>
              {/*========================여기까지================================*/}
              <OpenViduVideoComponent
                mode ={undefined}
                streamManager={selectId}
              />

          </>
        );
    }
    else{
        return(
        <>
            {/*========================테스트입니다=============================*/}
            <h1>애는 조건문을 못한애{props.user.streamManager.stream.connection.connectionId}</h1>
            {/*========================여기까지================================*/}
            <OpenViduVideoComponent
                mode ={undefined}
                streamManager={props.user.streamManager}
            />
        </>
        )
    }
};

export default SpeechCam;