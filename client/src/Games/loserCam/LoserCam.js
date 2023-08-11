import React, { useEffect } from "react";
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";
import styles from "./LoserCam.module.css";
import { effectSound } from "../../effectSound";
import laughing from "../../sounds/laughing.wav";
import loserSound from "../../sounds/Loser.mp3";
import stampSound from "../../sounds/StampSound.wav";
const LoserCam = (props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.end(undefined);
    }, 6.2 * 1000);

    const laughingSound = setTimeout(() => {
      effectSound(loserSound, false, 1);
      setTimeout(() => {
        effectSound(stampSound, false, 1);
      }, 1500);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(laughingSound);
    };
  }, []);

  const selectStreamManager = props.user.subscribers.find(
    (subscriber) => subscriber.stream.connection.connectionId === props.selectId
  );
  if (
    selectStreamManager &&
    (props.selectId ||
      selectStreamManager.stream.connection.connectionId ===
        props.user.streamManager.stream.connection.connectionId)
  ) {
    /* 루저가 내가 아닐때 */
    return (
      <>
        <img
          className={styles["end-image"]}
          src="../../stamp/loser.png"
          alt={"woo"}
        />
        <div>
          <OpenViduVideoComponent
            mode={props.mode}
            streamManager={selectStreamManager}
          />
        </div>
        <div className={styles.loserNick}>{props.conToNick[selectStreamManager.stream.connection.connectionId]}</div>
      </>
    );
  } else {
    /*루저가 나일때*/
    return (
      <>
        <img
          className={styles["end-image"]}
          src="../../stamp/loser.png"
          alt={"woo"}
        />
        <div>
          <OpenViduVideoComponent
            mode={props.mode}
            streamManager={props.user.streamManager}
          />
          <div className={styles.loserNick}>{props.user.getNickname()}</div>
        </div>
      </>
    );
  }
};

export default LoserCam;
