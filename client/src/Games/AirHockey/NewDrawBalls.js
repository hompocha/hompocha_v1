import { useEffect, useRef, useState } from "react";
import styles from "./NewDrawBalls.module.css";

class Ball {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.dx = Math.ceil(Math.random() * 3);
    this.dy = -Math.ceil(Math.random() * 3);
    this.ballRadius = 10 / 2;
    this.color = "yellow";
  }

  draw() {
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }

  update(canvas) {
    /* 왼쪽 벽 */
    if (this.x + this.dx > this.canvas.width - this.ballRadius / 2) {
      this.dx = -this.dx;
      // console.log("왼쪽 벽");
    }

    /* 오른쪽 벽 */
    if (this.x + this.dx < this.ballRadius / 2) {
      this.dx = -this.dx;
      // console.log("오른쪽 벽");
    }

    /* 위 쪽 */
    if (this.y + this.dy < this.ballRadius / 2) {
      this.dy = -this.dy;
      // console.log("위쪽 벽");
    }

    /* 아래 쪽 */
    if (this.y + this.dy > this.canvas.height - this.ballRadius / 2) {
      this.dy = -this.dy;
      // console.log("아래쪽 벽");
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}

function NewDrawBalls(x, y) {
  const canvasBallRef = useRef(null);
  const canvas = useRef(null);
  const [scoreRed, setScoreRed] = useState(0);
  const [scoreBlue, setScoreBlue] = useState(0);

  useEffect(() => {
    canvas.current = canvasBallRef.current;
    const ctx = canvas.current.getContext("2d");
    const balls = [
      new Ball(canvas.current),
      new Ball(canvas.current),
      new Ball(canvas.current),
      new Ball(canvas.current),
      new Ball(canvas.current),
    ];

    function handleGoal() {
      // 득점 처리 로직을 여기에 작성합니다.
      // 레드팀 골인 경우: this.x + this.dx > this.canvas.width - this.ballRadius / 2
      // 블루팀 골인 경우: this.x + this.dx < this.ballRadius / 2
      // 이러한 조건에 맞게 득점을 처리하고, scoreRed와 scoreBlue를 업데이트합니다.
      balls.forEach((ball) => {
        if (
          ball.x + ball.dx > ball.canvas.width - ball.ballRadius / 2 &&
          ball.y + ball.dy > ball.canvas.height / 4 &&
          ball.y + ball.dy < (ball.canvas.height * 3) / 4
        ) {
          setScoreRed((prevScore) => prevScore + 1);
          ball.x = ball.canvas.width / 2;
          ball.y = ball.canvas.height / 2;
        } else if (
          ball.x + ball.dx < ball.ballRadius / 2 &&
          ball.y + ball.dy > ball.canvas.height / 4 &&
          ball.y + ball.dy < (ball.canvas.height * 3) / 4
        ) {
          setScoreBlue((prevScore) => prevScore + 1);
          ball.x = ball.canvas.width / 2;
          ball.y = ball.canvas.height / 2;
        }
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
      balls.forEach((ball) => {
        ball.draw();
        ball.update();
      });

      handleGoal();

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }, []);

  return (
    <>
      <span>
        레드팀 {scoreRed} : {scoreBlue} 블루팀
      </span>
      <canvas className={styles.canvasBallRef} ref={canvasBallRef} />
    </>
  );
}

export default NewDrawBalls;
