// import "./styles.css";

import { useState, useEffect } from "react";
import styles from "./hpBar.module.css";

const HealthBar = ({ maxHp = 100, hp = 100, main = true } = {}) => {
  const barWidth = (hp / maxHp) * 100;

//   `${loaded ? styles.camMainWrap : ""
  return (
    <div>
    <div className={`${(main)? styles.healthBar:styles.subHealthBar}`}>
      <div className={`${(main)? styles.bar:styles.subBar}`} style={{ width: `${barWidth}%` }}></div>
      <div className={`${(main)? styles.hit : styles.subHit}`} style={{ width: `${0}%` }}></div>

        <div
          style={{
            position: "absolute",
            top: "5px",
            left: 0,
            right: 0,
            textAlign: "center"
          }}
        >
          {hp} / {maxHp}
        </div>
      </div>

      <br />
    </div>
  );
};


export {HealthBar};