import React, { useEffect } from "react";
import styles from "./CountDown.module.css";

import countDownSound from "../sounds/countDownSound.mp3";
import { effectSound } from "../effectSound";
const CountDown = () => {
  useEffect(() => {
    effectSound(countDownSound, false, 1);
  }, []);

  return (
    <div className={styles.countDown}>
      <div
        className={styles.countDownText}
        /* style={{ color: "white", fontSize: "34px" }} */
      >
        게임이 곧 시작됩니다!
      </div>
      <img
        className={styles.sojuCountDown}
        src="/Loading/countDown.gif"
        alt="countdown"
      />
      {/*<img src="/Drink/soju.png" alt="countdown" />*/}
    </div>
  );
};

export default CountDown;
