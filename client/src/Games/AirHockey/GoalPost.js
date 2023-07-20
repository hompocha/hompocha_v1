import React, { useRef, useEffect } from "react";
import styles from "./GoalPost.module.css";

function GoalPostRed() {
  const canvasRedRef = useRef(null);
  useEffect(() => {
    const teamRedGoalPost = canvasRedRef.current;
    const ctx = teamRedGoalPost.getContext("2d");
    function drawRedGoalPost() {
      ctx.beginPath();
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(-10, 20, 20, 80);
      ctx.closePath();
    }
    drawRedGoalPost();
  }, []);
  return <canvas className={styles.goalPost} ref={canvasRedRef} />;
}
function GoalPostBlue() {
  const canvasBlueRef = useRef(null);
  useEffect(() => {
    const teamBlueGoalPost = canvasBlueRef.current;
    const ctx = teamBlueGoalPost.getContext("2d");
    function drawBlueGoalPost() {
      ctx.beginPath();
      ctx.fillStyle = "blue";
      ctx.fillRect(290, 20, 20, 80);
      ctx.closePath();
    }
    drawBlueGoalPost();
  }, []);
  return <canvas className={styles.goalPost} ref={canvasBlueRef} />;
}

export { GoalPostRed, GoalPostBlue };
