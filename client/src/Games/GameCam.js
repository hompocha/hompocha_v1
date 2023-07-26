import styles from "./GameCam.module.css";
import { GoalPostBlue, GoalPostRed } from "./AirHockey/GoalPost";
import OpenViduVideoComponent from "../cam/OvVideo";
import UserVideoComponent from "../cam/UserVideoComponent";

function GameCam(props) {
  console.log(props);
  const mode = props.user.mode;
  const publisher = props.user.getStreamManager();
  const subscribers = props.user.getSubscriber();
  const members = [publisher, ...subscribers];
  const num = props.user.getSubscriber().length + 1;
  const undefined = "undefined";
  console.log(members);
  return (
    <>
      {props.mode === "airHockey" ? (
        <>
          <UserVideoComponent
            className={styles.userVideo}
            mode={props.mode}
            streamManager={publisher}
          />
          <GoalPostBlue />
          <GoalPostRed />
        </>
      ) : null}
    </>
  );
}

export default GameCam;
