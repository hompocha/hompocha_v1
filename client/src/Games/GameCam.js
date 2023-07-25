import styles from "./GameCam.module.css";
import { GoalPostBlue, GoalPostRed } from "./AirHockey/GoalPost";
import OpenViduVideoComponent from "../cam/OvVideo";

function GameCam(props) {
  return (
    <>
      {props.user.mode === "airHockey" ? (
        <>
          <OpenViduVideoComponent
            mode={props.user.mode}
            streamManager={props.user.getStreamManager()}
          />
          <GoalPostBlue />
          <GoalPostRed />
        </>
      ) : null}
    </>
  );
}

export default GameCam;
