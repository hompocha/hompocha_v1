import styles from "./GameCam.module.css";
import { GoalPostBlue, GoalPostRed } from "./AirHockey/GoalPost";
import DrawBalls from "./AirHockey/Ball";
import OpenViduVideoComponent from "../cam/OvVideo";

function GameCam(props) {
  return (
    <>
      <OpenViduVideoComponent
        state={props.state}
        streamManager={props.state.publisher}
      />
      {/* <canvas className={styles.webcamRef} ref={canvasRef} />
      <GoalPostRed />
      <GoalPostBlue />
      <DrawBalls /> */}
    </>
  );
}

export default GameCam;
