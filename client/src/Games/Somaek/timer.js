// import "./styles.css";

import { useState, useEffect } from "react";
import styles from "./timer.module.css";
import 'animate.css';

const TimerBar = ({ timeMax, gameEnd, start} = {}) => {
  const defaultTime = timeMax;
  const [timeleft, setTimeleft] = useState(defaultTime);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(()=>{
    let intervalId;
    if (start) {
      intervalId = setInterval(() => {
        if(timeleft <= 0){
          clearInterval(intervalId);
          gameEnd();
        } else {
          setTimeleft(timeleft-500);
          // console.log(timeleft);
          setAnimationClass("animate__animated animate__swing animate__faster animate__infinite	infinite");
        }
      }
      , 500);
    }
    return () => clearInterval(intervalId);
  },[start, timeleft]);
// animate__headShake
  // useEffect(() => {
  //     setAnimationClass("animate__animated animate__fadeIn");

  //     const timeout = setTimeout(() => {
  //       setAnimationClass("animate__animated animate__fadeOut");
  //     }, (0.5 + 1.5) * 1000); // backInLeft가 1.5초 동안 진행되고, 2초 동안 정지

  //     return () => clearTimeout(timeout);
  // }, []);

  return (
    <div>
        <div className={styles.timeBar}>
        <div className={styles.bar} style={{ width: `${(timeleft/timeMax)*100}%` }}></div>
        </div>
        <div className={`${animationClass} ${styles.stopWatch}`}></div>
    </div>
  );
};


export {TimerBar};




