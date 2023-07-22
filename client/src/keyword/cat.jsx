import React, { useEffect, useRef } from "react";
import styles from "./cat.module.css";

function CatCanvas({ x = 1100, y = 200 }) {
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

    async function drawCat(ctx, x, y) {
        let count = 0;
        const frames = [
        "/CAT1.png",
        "/CAT2.png",
        "/CAT3.png",
        "/CAT4.png",
        "/CAT5.png",
        "/CAT6.png",
        ];

        const images = await Promise.all(frames.map((src) => loadImage(src)));

        const direction = Math.random() < 0.5 ? -1 : 1;

        if (direction === -1) {
            x = 1500;
            y = 200;
        } else {
            x = 0;
            y = 200;
        }
    

        function animate() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const currentImage = images[count % images.length];
        drawImage(ctx, currentImage, x, y, 250, 250, direction === -1);
        count += 1;
        x += direction * 10;
        }

        setInterval(animate, 100);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        drawCat(ctx, x, y);
    }, [x, y]);

    return <canvas ref={canvasRef} width="2200" height="430" />;
}

export default CatCanvas;
