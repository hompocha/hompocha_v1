// import "./styles.css";

import { useState, useEffect } from "react";
import styles from "./timer.module.css";

const TimerBar = ({ timeMax, gameEnd, start} = {}) => {
  // const barWidth = (timeLeft / timeMax) * 100;
  const defaultTime = timeMax;
  const [timeleft, setTimeleft] = useState(defaultTime);

  useEffect(()=>{
    let intervalId;
    if (start) {
      intervalId = setInterval(() => {
        if(timeleft <= 0){
          clearInterval(intervalId);
          gameEnd();
        } else {
          setTimeleft(timeleft-100);
        }
      }
      , 100);
    }
    return () => clearInterval(intervalId);
  },[start, timeleft]);

  return (
    <div>
        {/* <img src="../../timer.png" alt="timer"/> */}
        <div className={styles.stopWatch}></div>
        <div className={styles.timeBar}>
        <div className={styles.bar} style={{ width: `${(timeleft/timeMax)*100}%` }}></div>
        </div>
    </div>
  );
};


export {TimerBar};

// import React, { useState, useEffect } from "react";
// import {styles} from "./timer.module.css";
// const Timer = ({gameTime}) => {
//   const [time, setTime] = useState(gameTime);
//   const [isRunning, setIsRunning] = useState(true);

//   useEffect(() => {
//     let intervalId;
//     if (isRunning) {
//       intervalId = setInterval(() => setTime(time - 1), 10);
//     }
//     return () => clearInterval(intervalId);
//   }, [isRunning, time]);


//   // Seconds calculation
//   const seconds = Math.floor((time % 6000) / 100);

//   // Milliseconds calculation
//   const milliseconds = time % 100;

//   // Method to start and stop timer
//   const startAndStop = () => {
//     setIsRunning(!isRunning);
//   };

//   // Method to reset timer back to 0
//   const reset = () => {
//     setTime(gameTime);
//   };
//   return (
//     <div className="stopwatch-container">
//       <p className="stopwatch-time">
//         {seconds.toString().padStart(2, "0")}:
//         {milliseconds.toString().padStart(2, "0")}
//       </p>
//       {/* <div className="stopwatch-buttons">
//         <button className="stopwatch-button" onClick={startAndStop}>
//           {isRunning ? "Stop" : "Start"}
//         </button>
//         <button className="stopwatch-button" onClick={reset}>
//           Reset
//         </button>
//       </div> */}
//     </div>
//   );
// };

// export {Timer};


