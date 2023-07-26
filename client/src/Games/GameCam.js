import styles from "./GameCam.module.css";
import { GoalPostBlue, GoalPostRed } from "./AirHockey/GoalPost";
import OpenViduVideoComponent from "../cam/OpenViduVideoComponent";
import DuckVideo from "./DuckCatching/DuckVideo";
import { Airhockey } from "./AirHockey/Airhockey";

function GameCam(props) {
  console.log(props.mode);
  return (
    <>
      {props.mode === "airHockey" ? (
        <>
          <Airhockey user={props.user}
           sessionConnected={props.sessionConnected}/>
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
