import React, { useRef, useEffect } from "react";
import styles from "./Balls.module.css";

function DrawBalls(x, y) {
  const canvasBallRef = useRef(null);
  useEffect(() => {
    const canvas = canvasBallRef.current;
    const ctx = canvas.getContext("2d");
    const ballRadius = 5;

    ctx.beginPath();
    ctx.arc(x, y, ballRadius / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "yellow";
    ctx.closePath();
    const balls = [
      {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: -1,
        dy: 0.5,
      },
      {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        dx: -Math.ceil(Math.random() * 3),
        dy: Math.ceil(Math.random() * 3),
      },
      {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        dx: Math.ceil(Math.random() * 3),
        dy: -Math.ceil(Math.random() * 3),
      },
      {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        dx: Math.ceil(Math.random() * 3),
        dy: -Math.ceil(Math.random() * 3),
      },
      {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        dx: Math.ceil(Math.random() * 3),
        dy: -Math.ceil(Math.random() * 3),
      },
    ];
    function drawBall(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      return ctx;
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 각 공에 대하여 그리기 작업 수행

      balls.forEach((ball) => {
        drawBall(ball.x, ball.y);
        if (ball.x + ball.dx > canvas.width - ballRadius) {
          if (
            ball.y + ball.dy > ballRadius ||
            ball.y + ball.dy < canvas.height - ballRadius
          ) {
            ball.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
        // // 캔버스 경계와 충돌 처리
        if (
          // 좌측 벽에 부딪히는 경우 || 우측 벽에 부딪히는 경우
          ball.x + ball.dx > canvas.width - ballRadius ||
          ball.x + ball.dx < ballRadius
        ) {
          ball.dx = -ball.dx;
        }
        if (ball.x + ball.dx)
          if (
            ball.y + ball.dy > canvas.height - ballRadius ||
            ball.y + ball.dy < ballRadius
          ) {
            ball.dy = -ball.dy;
          }

        ball.x += ball.dx;
        ball.y += ball.dy;
      });

      // draw 함수가 호출될 때마다 반복 실행하도록 설정
      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw); // 최초 한 번 그리기 함수 호출 // 최초 한 번 그리기 함수 호출
  }, []);

  return <canvas className={styles.canvasBallRef} ref={canvasBallRef} />;
}

export default DrawBalls;
