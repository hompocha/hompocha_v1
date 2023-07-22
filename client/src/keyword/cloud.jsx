import React, { useEffect, useRef } from "react";
import styles from "./cat.module.css";

function CloudCanvas() {
  const canvasRef = useRef(null);

  function drawBall(ctx, x, y) {
    const image = new Image();
    image.src = "/cloud.png"; 
    ctx.drawImage(image, x - 20 , y -200 , 250, 250); 
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 3;
    let dy = -3;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall(ctx, x, y);
      x += dx;
      y += dy;
      if (x  < 0 || x + 80 > canvas.width) {
        dx = -dx;
      }

      if (y < 0 || y + 10 > canvas.height) {
        dy = -dy;
      }
    }

    const interval = setInterval(draw, 10);

    return () => clearInterval(interval);
  }, []);

  return <canvas className={styles.cat} ref={canvasRef} width="1950" height="500" />;
}

export default CloudCanvas;
