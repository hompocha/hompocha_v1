import React, { useEffect, useRef } from "react";
import styles from "./cloud.module.css";

export function CloudCanvas() {
    const x = 1100, y = 0;
    const canvasRef = useRef(null);

    function loadImage(src) {
        return new Promise((resolve) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
        });
    }

    function drawImage(ctx, image, x, y, width, height, mirrored) {
        ctx.save();
        ctx.scale(mirrored ? -1 : 1, 1);
        ctx.drawImage(image, mirrored ? -x - width : x, y, width, height);
        ctx.restore();
    }

    async function drawCloud(ctx, x, y) {
        let count = 0;
        const frames = [
            "/Cloud/cloud1.png",
            "/Cloud/cloud2.png",
            "/Cloud/cloud3.png",
            "/Cloud/cloud4.png",
            "/Cloud/cloud5.png",
            "/Cloud/cloud6.png",
            "/Cloud/cloud7.png",
            "/Cloud/cloud8.png",

        ];

        const images = await Promise.all(frames.map((src) => loadImage(src)));

        function getRandomX() {
            return Math.floor(Math.random() * 1301); 
        }

        x = getRandomX();
        y = 0;

        function animate() {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            const currentImage = images[count % images.length];
            drawImage(ctx, currentImage, x, y, 350, 250, x > ctx.canvas.width / 2); 
            count += 1;
            x += x > ctx.canvas.width / 2 ? -10 : 10; 
            if (x <= -250) {
                x = ctx.canvas.width;
            } else if (x >= ctx.canvas.width) {
                x = -250;
            }
        }
        setInterval(animate, 500);
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        drawCloud(ctx, x, y);
    }, [x, y]);

    return <canvas className = {styles.size} ref={canvasRef} width="2200" height="300" />;
}

export default CloudCanvas;
