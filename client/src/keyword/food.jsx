import React, { useEffect, useState } from "react";
import styles from "./food.module.css";

export function FoodImage() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  function loadImage(src) {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve(image);
    });
  }

  async function loadFoodImage() {
    const frames = [
      "/Food/chicken.png",
      "/Food/chickenWing.png",
      "/Food/riceCake.png",
      "/Food/oDol.png",
      "/Food/eggMalE.png",
      "/Food/fish.png",
    ];

    const randomIndex = Math.floor(Math.random() * frames.length);
    const randomImage = frames[randomIndex];
    const image = await loadImage(randomImage);
    setImageSrc(image);
  }

  function getRandomPosition() {
    const x = Math.floor(Math.random() * (window.innerWidth - 350));
    const y = Math.floor(Math.random() * (window.innerHeight - 250));
    return { x, y };
  }

  useEffect(() => {
    loadFoodImage();

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc.src);
      }
    };
  }, []);

  useEffect(() => {
    setImagePosition(getRandomPosition());
  }, [imageSrc]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageSrc(null);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [imageSrc]);

  return (
    <div>
      {imageSrc && (
        <img
          className={styles.size}
          src={imageSrc.src}
          alt="Food Image"
          style={{
            position: "absolute",
            left: imagePosition.x,
            top: imagePosition.y,
          }}
          width="350"
          height="250"
        />
      )}
    </div>
  );
}

export default FoodImage;
