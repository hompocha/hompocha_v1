import React, { useEffect, useRef } from "react";
import styles from "./Dog.module.css";

export function DogCanvas() {
    //DogCanvas 컴포넌트를 생성하고 초기 x,y 좌표 및 canvasRef를 설정 
    const x = 1100, y = 200    
    const canvasRef = useRef(null);

    //주어진 이미지 경로를 로드하여 Promise를 반환함
    function loadImage(src) {
        return new Promise((resolve) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
        });
    }

    //이미지를 캔버스에 그린다
    //원하는 위치(x,y,), 크기(width, height) 및 미러링 여부와 함께 화면에 렌더링함
    function drawImage(ctx, image, x, y, width, height, mirrored) {
        ctx.save();
        ctx.scale(mirrored ? -1 : 1, 1);
        ctx.drawImage(image, mirrored ? -x - width : x, y, width, height);
        ctx.restore();
    }

    // 애니메이션 그림을 배열에 넣은 다음 Promise.all을 사용하여 모든 이미지를 로드
    async function drawDog(ctx, x, y) {
        let count = 0;
        const frames = [
        "/Dog/dog1.png",
        "/Dog/dog2.png",
        "/Dog/dog3.png",
        "/Dog/dog4.png",
        "/Dog/dog5.png",
        "/Dog/dog6.png",
        "/Dog/dog7.png",
        "/Dog/dog8.png",
        "/Dog/dog9.png",
        ];
        const images = await Promise.all(frames.map((src) => loadImage(src)));

        //direction 변수로 이미지가 왼쪽이나 오른쪽을 향할지 결정함 필요한 경우 x및 y좌표를 업데이트
        const direction = Math.random() < 0.5 ? -1 : 1;
        if (direction === -1) {
            x = 1500;
            y = 200;
        } else {
            x = 0;
            y = 200;
        }

        //캔버스를 지우고 현재 이미지를 그린 후 다음 프레임을 이헤 count를 늘리고 x 위치를 업데이트 100ms마다 실행
        function animate() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const currentImage = images[count % images.length];
        drawImage(ctx, currentImage, x, y, 250, 250, direction === -1);
        count += 1;
        x += direction * 10;
        }
        setInterval(animate, 100);
    }
    //drawDog 함수는 캔버스를 그린 다음 연결
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        drawDog(ctx, x, y);
    }, [x, y]);
    //캔버스를 반환하고 DogCanvas를 내보냄
    return <canvas ref={canvasRef} width="2200" height="430" />;
}

export default DogCanvas;
