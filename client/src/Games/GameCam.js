import styles from "./GameCam.module.css";
import { GoalPostBlue, GoalPostRed } from "./AirHockey/GoalPost";
import OpenViduVideoComponent from "../cam/OvVideo";

function GameCam(props) {
  console.log(props.mode);
  return (
    <>
      {props.mode === "airHockey" ? (
        <>
          <OpenViduVideoComponent
            mode={props.mode}
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
