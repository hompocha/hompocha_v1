import React, { useRef, useEffect } from "react";
import styles from "./Balls.module.css";

class Ball {
  constructor(canvas, x, y) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.x = x;
    this.y = y;
    this.dx = Math.ceil(Math.random() * 3);
    this.dy = -Math.ceil(Math.random() * 3);
    this.ballRadius = 10;
    this.color = "yellow";
  }

  draw() {
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(
      this.x - this.ballRadius / 2, // x좌표에서 반지름의 절반 크기만큼 이동
      this.y - this.ballRadius / 2, // y좌표에서 반지름의 절반 크기만큼 이동
      this.ballRadius / 2, // 반지름 크기를 나누어서 반지름을 조정
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  update() {
    if (this.x + this.dx > this.canvas.width - this.ballRadius) {
      if (
        this.y + this.dy > this.ballRadius ||
        this.y + this.dy < this.canvas.height - this.ballRadius
      ) {
        this.ctx.clearRect(this.x, this.y, this.width, this.height);
        console.log("WOWoW");
      }
    }

    if (
      this.x + this.dx > this.canvas.width - this.ballRadius ||
      this.x + this.dx < this.ballRadius
    ) {
      this.dx = -this.dx;
    }
    if (
      this.y + this.dy > this.canvas.height - this.ballRadius ||
      this.y + this.dy < this.ballRadius
    ) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}

function DrawBalls(x, y) {
  const canvasBallRef = useRef(null);

  useEffect(() => {
    const canvas = canvasBallRef.current;
    const ctx = canvas.getContext("2d");
    const balls = [
      new Ball(canvas, canvas.width / 2, canvas.height / 2),
      new Ball(
        canvas,
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100)
      ),
      new Ball(
        canvas,
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100)
      ),
      new Ball(
        canvas,
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100)
      ),
      new Ball(
        canvas,
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100)
      ),
    ];

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      balls.forEach((ball) => {
        ball.draw();
        ball.update();
        // console.log(balls);
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }, []);

  return <canvas className={styles.canvasBallRef} ref={canvasBallRef} />;
}

export default DrawBalls;
