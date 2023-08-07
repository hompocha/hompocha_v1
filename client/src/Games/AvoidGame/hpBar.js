// import "./styles.css";

import { useState, useEffect } from "react";
import styles from "./hpBar.css";

const HealthBar = ({ maxHp = 100, hp = 100 } = {}) => {
  const barWidth = (hp / maxHp) * 100;

  return (
    <div>
      <div class="health-bar">
        <div class="bar" style={{ width: `${barWidth}%` }}></div>
        <div class="hit" style={{ width: `${0}%` }}></div>

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

const SubHealthBar = ({ maxHp = 100, subStates, id } = {}) => {
    console.log(subStates,id);
    const gameState = subStates[id];
    if(!gameState) return;
    const hp = gameState.hpBar.hpLeft;
    const barWidth = (hp / maxHp) * 100;
  
    return (
      <div>
        <div class="health-bar">
          <div class="bar" style={{ width: `${barWidth}%` }}></div>
          <div class="hit" style={{ width: `${0}%` }}></div>
  
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

export {HealthBar, SubHealthBar};