import React, { useEffect, useRef } from "react";
import styles from "./cherryBlossom.module.css";
const TOTAL = 100;
const petalArray = [];

const CherryBlossom = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = 3400; // 원하는 너비로 설정
    canvas.height = 1500; // 원하는 높이로 설정
    const ctx = canvas.getContext("2d");

    const petalImg = new Image();
    petalImg.src = "https://djjjk9bjm164h.cloudfront.net/petal.png";

    petalImg.addEventListener("load", () => {
      for (let i = 0; i < TOTAL; i++) {
        petalArray.push(new Petal());
      }
      render();
    });

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petalArray.forEach((petal) => petal.animate());
      window.requestAnimationFrame(render);
    }

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    let mouseX = 0;

    // Petal class
    class Petal {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = (Math.random() * canvas.height * 2) - canvas.height;
        this.w = (25 + Math.random() * 15) / 2; // 이미지 넓이 절반으로 줄이기
        this.h = (20 + Math.random() * 10) / 2; // 이미지 높이 절반으로 줄이기
        this.opacity = this.w / 30;
        this.flip = Math.random();

        this.xSpeed = 1 + Math.random() * 1;
        this.ySpeed = 1 + Math.random() * 1;
        this.flipSpeed = Math.random() * 0.03;
      }

      draw() {
        if (this.y > canvas.height || this.x > canvas.width) {
          this.x = -petalImg.width;
          this.y = (Math.random() * canvas.height * 2) - canvas.height;
          this.xSpeed = 1 + Math.random() * 1;
          this.ySpeed = 1 + Math.random() * 1;
          this.flip = Math.random();
        }
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
          petalImg,
          this.x,
          this.y,
          this.w * (0.6 + (Math.abs(Math.cos(this.flip)) / 3)),
          this.h * (0.8 + (Math.abs(Math.sin(this.flip)) / 5))
        );
      }

      animate() {
        this.x += this.xSpeed + mouseX * 2.5;
        this.y += this.ySpeed + mouseX * 1;
        this.flip += this.flipSpeed;
        this.draw();
      }
    }
  }, [canvasRef]);

  return <canvas className= {styles.size} ref={canvasRef} />
};

export default CherryBlossom;