import React, { useEffect } from 'react';
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";
import styles from "./LoserCam.module.css";


const LoserCam = (props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.end(undefined);
    }, 6200);

    return () => {
      clearTimeout(timer);
    };
  }, [])

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
        <img className={styles['end-image']} src="../../stamp/loser.png" alt={"woo"}/>
        <div>
        <OpenViduVideoComponent
          mode={props.mode}
          streamManager={selectId}
        />
        </div>
      </>
    );
  } else {
    return (
      <>
        <img className={styles['end-image']} src="../../stamp/loser.png" alt={"woo"}/>
        <div>
        <OpenViduVideoComponent
          mode={props.mode}
          streamManager={props.user.streamManager}
        />
        </div>
      </>
    );
  }
};

export default LoserCam;
