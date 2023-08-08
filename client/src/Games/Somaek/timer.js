// import "./styles.css";

import { useState, useEffect } from "react";
import styles from "./timer.module.css";

const TimerBar = ({ timeMax, gameEnd, start} = {}) => {
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
        <div className={styles.stopWatch}></div>
        <div className={styles.timeBar}>
        <div className={styles.bar} style={{ width: `${(timeleft/timeMax)*100}%` }}></div>
        </div>
    </div>
  );
};


export {TimerBar};




