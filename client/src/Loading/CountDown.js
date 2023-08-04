import React from "react";
import styles from "./CountDown.module.css";
const CountDown = () => {
  return (
    <div className={styles.countDown}>
      <h2 style={{color: 'white', fontSize: '34px'}}>게임이 곧 시작됩니다!</h2>
      <img src="/Loading/countDown.gif" alt="countdown" />
      {/*<img src="/Drink/soju.png" alt="countdown" />*/}
    </div>
  );
};

export default CountDown;
