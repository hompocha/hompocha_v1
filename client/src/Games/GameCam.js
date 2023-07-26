import styles from "./GameCam.module.css";
import { GoalPostBlue, GoalPostRed } from "./AirHockey/GoalPost";
import OpenViduVideoComponent from "../cam/OpenViduVideoComponent";
import DuckVideo from "./DuckCatching/DuckVideo";

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

        </>
      ) : null}
      {props.mode === "movingDuck" ? (
        <>
          <DuckVideo
            mode={props.mode}
            streamManager={props.user.getStreamManager()}
          />
        </>
      ) : null}
    </>
  );
}

export default GameCam;
