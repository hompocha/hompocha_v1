import React from "react";
import styles from "./CountDown.module.css";
const CountDown = () => {
  return (
    <div className={styles.countDown}>
      <h3>카운트다운!!!!</h3>
      <img src="/Loading/countDown.gif" alt="countdown" />
      {/*<img src="/Drink/soju.png" alt="countdown" />*/}
    </div>
  );
};

export default CountDown;
