import styles from "./GameCam.module.css";
import { GoalPostBlue, GoalPostRed } from "./AirHockey/GoalPost";
import OpenViduVideoComponent from "../cam/OvVideo";

function GameCam(props) {
  return (
    <>
      {props.state.mode === "airHockey" ? (
        <>
          <OpenViduVideoComponent
            state={props.state}
            streamManager={props.state.publisher}
          />
          <GoalPostBlue />
          <GoalPostRed />
        </>
      ) : null}
    </>
  );
}

export default GameCam;
