import React, { useEffect, useRef, useState } from "react";
import Loading from "../../Loading/Loading";
import CountDown from "../../Loading/CountDown";
import styles from "./Somaek.module.css";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, VERSION } from "@mediapipe/hands";
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";
import LoserCam from "../loserCam/LoserCam";
import somaekBGM from "../../sounds/somaekBGM.mp3";
import somaekSuccess from "../../sounds/somaekSuccess.wav";
import somaekFail from "../../sounds/somaekFail.wav";
import { effectSound } from "../../effectSound";

const objectsDefault = [
  { leftX: 0.75, topY: 0.05, lenX: 0.5, lenY: 0.5, type: "beer" },
  { leftX: 0.75, topY: 0.28, lenX: 0.5, lenY: 0.5, type: "mak" },
  { leftX: 0.75, topY: 0.5, lenX: 0.5, lenY: 0.5, type: "soju" },
  { leftX: 0.75, topY: 0.73, lenX: 0.5, lenY: 0.5, type: "cider" },
];

/* 물체를 그리는 부분 */
const images = {
  soju: "../../Drink/soju.png",
  beer: "../../Drink/beer.png",
  mak: "../../Drink/mak.png",
  container: "../../Drink/empty.png",
  cider: "../../Drink/cider.png",
  madam: "../../Madam/madam3.png",
  speechBubble: "../../speechBubble.png",
  rank: "../../rank.png",
};



/*======================================================= */  
/*=================== 메인 함수 시작=================== */  
/*======================================================= */  

const Somaek = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [start, setStart] = useState(false);
  const [countDown, setCountDown] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lowestConId, setLowestConId] = useState(undefined);
  const [handStop, setHandStop] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);
  const objectRef = useRef(JSON.parse(JSON.stringify(objectsDefault)));
  const signalInterval = useRef(null);
  const hostId = props.selectId;
  const timerPrint = useRef(15000);
  const imgElements = [];
  const subscribers = props.user.subscribers;
  // const scores = {};

  const scores = useRef({});
  for (let i = 0; i < subscribers.length; i++) {
    const conId = subscribers[i].stream.connection.connectionId;
    scores.current[props.conToNick[conId]] = 0;
  }
  scores.current[props.user.getNickname()] = 0;

  const states = {};
  for (let i = 0; i < subscribers.length; i++) {
    const conId = subscribers[i].stream.connection.connectionId;
    states[props.conId] = undefined;
  }

  const container = {
    leftX: 0.15,
    topY: 0.4,
    lenX: 0.2,
    lenY: 0.2,
    type: "cup",
  };
  const conX = container.leftX; //*1280;
  const conY = container.topY; //*720;

  let score = 0;
  let order = [];
  let inBucket = [];
  let orderKorean = [];



/*======================================================= */  
/*=================== 게임 시작=================== */  
/*======================================================= */  
  /* 게임시작, 타이머 주기 */
  useEffect(() => {
    if (!start) return;
    timerPrint.current = 400 * 1000; /*시연*/

    const sound = effectSound(somaekBGM, true, 0.2);

    signalInterval.current = setInterval(() => {
      sendStateSignal();
      if (start && timerPrint.current > 0) timerPrint.current -= 1000;
      /* 게임이 끝났을 경우 */ else {
        clearInterval(signalInterval.current);
        // const sortedScores = Object.entries(scores).sort(
        //   ([, a], [, b]) => b - a
        // );
        // const lowestScorePerson = sortedScores[sortedScores.length - 1];
        // setLowestConId(lowestScorePerson[0]);
        setHandStop(true);

        setTimeout(() => {
          if (!isGameOver) {
            objectRef.current = JSON.parse(JSON.stringify(objectsDefault));
            setIsGameOver(true);
          }
        }, 500);
      }
    }, 1000);
    return () => {
      clearInterval(signalInterval.current);
      sound.stop();
    };
  }, [start]);


/*======================================================= */  
/*===================손 인식 및 게임 화면 그리기=================== */  
/*======================================================= */  
  /* 손 인식 부분 */
  useEffect(() => {
    let didCancel = false;

    const loadHandsAndCamera = async () => {
      if (!videoRef.current || !canvasRef.current || handStop) {
        return;
      }
      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
      });
      let camera;

      if (videoRef.current && canvasRef.current) {
        canvasCtx.current = canvasRef.current.getContext("2d");

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults(onResults);

        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (!didCancel) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: videoRef.current.width,
          height: videoRef.current.height,
        });
        camera.start();
      }
      return () => {
        if (camera) {
          camera.stop();
        }
      };
    };

    loadHandsAndCamera();
    return () => {
      didCancel = true;
    };
  }, [handStop]);

  

  /* on Results */
  const onResults = (results) => {
    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        const landmarks = results.multiHandLandmarks[index];

        objDrag(landmarks, canvasRef);
      }
    }
    if (!handStop)
      loadImages(canvasRef.current, canvasCtx.current, objectRef.current);
  };

  const loadImages = async (can_ref, can_ctx, objs) => {
    try {
      for (let type in images) {
        const img = new Image();
        img.src = images[type];
        // 이미지 로딩을 Promise로 감싸 비동기로 처리
        await new Promise((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () =>
            reject(new Error(`Failed to load ${images[type]}`));
        });
        imgElements[type] = img;
      }
      // 모든 이미지 로딩이 완료되면 애니메이션 시작
      drawSoju(can_ref, can_ctx, objs);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  const drawSoju = (can_ref, can_ctx, objs) => {
    // if(!isMounted) return;
    if (!can_ref) return;
    can_ctx.clearRect(0, 0, can_ctx.canvas.width, can_ctx.canvas.height);

    const madamImg = imgElements["madam"];

    const desiredLeftX = 0.07; // 원하는 X 위치를 설정하세요 (예시: 0).
    const desiredTopY = 0.315; // 원하는 Y 위치를 설정하세요 (예시: 0).
    const desiredWidth = 0.13; // 원하는 너비값을 설정하세요 (예시: 100).
    const desiredHeight = 0.4; // 원하는 높이값을 설정하세요 (예시: 100).

    can_ctx.drawImage(
      madamImg,
      desiredLeftX * can_ref.width,
      desiredTopY * can_ref.height,
      desiredWidth * can_ref.width,
      desiredHeight * can_ref.height
    );

    const speechBubbleImg = imgElements["speechBubble"];

    const bubbleLeftX = 0.07; // 원하는 X 위치를 설정하세요 (예시: 0).
    const bubbleTopY = 0.05; // 원하는 Y 위치를 설정하세요 (예시: 0).
    const bubbleWidth = 0.13; // 원하는 너비값을 설정하세요 (예시: 100).
    const bubbleHeight = 0.27; // 원하는 높이값을 설정하세요 (예시: 100).

    can_ctx.drawImage(
      speechBubbleImg,
      bubbleLeftX * can_ref.width,
      bubbleTopY * can_ref.height,
      bubbleWidth * can_ref.width,
      bubbleHeight * can_ref.height
    );

    for (let i = 0; i < objs.length; i++) {
      let boxLocation = objs[i];
      const img = imgElements[boxLocation.type]; // type에 따른 이미지 선택
      can_ctx.drawImage(
        img,
        boxLocation.leftX * can_ref.width,
        boxLocation.topY * can_ref.height,
        boxLocation.lenX * can_ref.width * 0.5,
        boxLocation.lenY * can_ref.height * 0.5
      );
    }
    can_ctx.drawImage(
      imgElements["container"],
      container.leftX * can_ref.width,
      container.topY * can_ref.height,
      container.lenX * can_ref.width,
      container.lenY * can_ref.height
    );
    /* InBucket용 */
    for (let i = 0; i < inBucket.length; i++) {
      let boxLocation = inBucket[i];
      const img = imgElements[boxLocation.type]; // type에 따른 이미지 선택

      can_ctx.drawImage(
        img,
        (0.1 - 0.02 * i) * can_ref.width,
        0.4 * can_ref.height,
        0.13 * can_ref.width,
        0.13 * can_ref.height
      );
    }

    const rectLeftX = 0.09;
    const rectTopY = 0.73;
    const rectWidth = 0.11;
    const rectHeight = 0.265;
    const borderRadius = 10; // 원하는 테두리 둥글기 값을 설정하세요 (예시: 10).
    can_ctx.fillStyle = "rgba(255, 204, 153, 0.8)";
    // 경로 시작
    can_ctx.beginPath();
    // 좌상단 점으로 이동
    can_ctx.moveTo(
      rectLeftX * can_ref.width + borderRadius,
      rectTopY * can_ref.height
    );
    // 상단 선 그리기
    can_ctx.lineTo(
      rectLeftX * can_ref.width + rectWidth * can_ref.width - borderRadius,
      rectTopY * can_ref.height
    );
    // 우상단 라운드 그리기
    can_ctx.arcTo(
      rectLeftX * can_ref.width + rectWidth * can_ref.width,
      rectTopY * can_ref.height,
      rectLeftX * can_ref.width + rectWidth * can_ref.width,
      rectTopY * can_ref.height + borderRadius,
      borderRadius
    );
    // 우측 선 그리기
    can_ctx.lineTo(
      rectLeftX * can_ref.width + rectWidth * can_ref.width,
      rectTopY * can_ref.height + rectHeight * can_ref.height - borderRadius
    );
    // 우하단 라운드 그리기
    can_ctx.arcTo(
      rectLeftX * can_ref.width + rectWidth * can_ref.width,
      rectTopY * can_ref.height + rectHeight * can_ref.height,
      rectLeftX * can_ref.width + rectWidth * can_ref.width - borderRadius,
      rectTopY * can_ref.height + rectHeight * can_ref.height,
      borderRadius
    );
    // 하단 선 그리기
    can_ctx.lineTo(
      rectLeftX * can_ref.width + borderRadius,
      rectTopY * can_ref.height + rectHeight * can_ref.height
    );
    // 좌하단 라운드 그리기
    can_ctx.arcTo(
      rectLeftX * can_ref.width,
      rectTopY * can_ref.height + rectHeight * can_ref.height,
      rectLeftX * can_ref.width,
      rectTopY * can_ref.height + rectHeight * can_ref.height - borderRadius,
      borderRadius
    );
    // 좌측 선 그리기
    can_ctx.lineTo(
      rectLeftX * can_ref.width,
      rectTopY * can_ref.height + borderRadius
    );
    // 좌상단 라운드 그리기
    can_ctx.arcTo(
      rectLeftX * can_ref.width,
      rectTopY * can_ref.height,
      rectLeftX * can_ref.width + borderRadius,
      rectTopY * can_ref.height,
      borderRadius
    );
    // 경로 종료
    can_ctx.closePath();
    // 경로 영역 채우기
    can_ctx.fill();
    // can_ctx.globalCompositeOperation = "source-over";
    const rankImg = imgElements["rank"];

    const rankLeftX = -0.06; // 원하는 X 위치를 설정하세요 (예시: 0).
    const rankTopY = 0.6; // 원하는 Y 위치를 설정하세요 (예시: 0).
    const rankWidth = 0.47; // 원하는 너비값을 설정하세요 (예시: 100).
    const rankHeight = 0.47; // 원하는 높이값을 설정하세요 (예시: 100).

    // can_ctx.globalCompositeOperation = "destination-over";
    can_ctx.drawImage(
      rankImg,
      rankLeftX * can_ref.width,
      rankTopY * can_ref.height,
      rankWidth * can_ref.width,
      rankHeight * can_ref.height
    );
    /* score 출력 부분 */
    can_ctx.save(); // 현재 컨텍스트 상태를 저장
    can_ctx.scale(-1, 1); // X 축을 따라 스케일을 반전시킴 (좌우 반전)
    // can_ctx.fillStyle = "black";
    // can_ctx.font = "30px Arial";
    // const fontSize = can_ref.width * speechWidth * 0.1; // 원하는 폰트 크기 비율을 적용 (0.04는 예시적인 값입니다.)
    // can_ctx.fillText(`점수: ${score}`, -can_ref.width + 20, 50);

    const speechLeftX = 0.17; // 원하는 X 위치를 설정하세요 (예시: 0).
    const speechTopY = 0.1; // 원하는 Y 위치를 설정하세요 (예시: 0).
    const speechWidth = 0.13; // 원하는 너비값을 설정하세요 (예시: 100).

    /* 소주1병, 맥주1명 주문내역 텍스트 캔버스에 출력 */
    orderKorean.forEach((text, index) => {
      can_ctx.fillStyle = "black"; // 텍스트 색상을 검은색으로 설정
      const fontSize = can_ref.width * speechWidth * 0.13; // 원하는 폰트 크기 비율을 적용 (0.04는 예시적인 값입니다.)
      can_ctx.font = `${fontSize}px Arial`; // 폰트와 크기를 설정
      const textX = -can_ref.width * speechLeftX;
      const textY = can_ref.height * speechTopY + (index + 1) * 35;
      const maxWidth = can_ref.width * speechWidth; // 텍스트의 최대 너비를 캔버스 너비의 비율로 설정
      can_ctx.fillText(text, textX, textY, maxWidth); // 텍스트를 캔버스에 쓰기
    });

    if (orderKorean[0] !== "감사합니다!!") {
      can_ctx.fillStyle = "black";
      const fontSize = can_ref.width * speechWidth * 0.13; // 원하는 폰트 크기 비율을 적용 (0.04는 예시적인 값입니다.)
      can_ctx.font = `${fontSize}px Arial`;
      const textX = -can_ref.width * speechLeftX;
      const textY = can_ref.height * speechTopY;
      const maxWidth = can_ref.width * speechWidth; // 텍스트의 최대 너비를 캔버스 너비의 비율로 설정
      can_ctx.fillText("사장님", textX, textY, maxWidth);
      const orderTextY =
        can_ref.height * speechTopY + (orderKorean.length + 1) * 35;
      can_ctx.fillText("주문이요~", textX, orderTextY, maxWidth);
    }

    // can_ctx.fillText(`남은시간: ${timer}`, -can_ref.width + 20, 100);
    can_ctx.fillStyle = "black";
    can_ctx.font = "bold 20px Arial";
    // can_ctx.fillText("남은시간 : ", -can_ref.width + 1500, 40);
    let blink = Math.floor(Date.now() / 500) % 2; // Change modulus value to control the blinking speed
    if (blink) {
      can_ctx.fillStyle = "dimgrey";
      can_ctx.font = "bold 45px Arial";
      can_ctx.fillText(
        `남은시간: ${timerPrint.current / 1000}초`,
        -can_ref.width + 1600,
        50
      );
    }

    /* 점수가 높은사람부터 출력 */
    Object.entries(scores.current)
      .sort(([, a], [, b]) => b - a) // 점수를 기준으로 내림차순 정렬합니다.
      .forEach(([key, value], index) => {
        if (key == props.user.getNickname()) {
          can_ctx.fillStyle = "green";
        } else if (index === 0) {
          can_ctx.fillStyle = "blue"; //1등
        } else {
          can_ctx.fillStyle = "black";
        }
        /* 소수점 없이 점수 올림 해서 출력 */
        const upValue = Math.ceil(value);
        const scoreText = `${key}: ${upValue}`;
        const y = 800 + (index + 1) * 30;
        can_ctx.font = "bold 33px Arial";

        // 그림 위에 텍스트가 나타납니다.
        can_ctx.globalCompositeOperation = "source-over";
        can_ctx.fillText(scoreText, -300, y);
      });

    can_ctx.restore();
  };

  const objMove = (fingerpick, boxIndex) => {
    if (!canvasRef) return;

    const { x: fingerX, y: fingerY, z: _ } = fingerpick;
    objectRef.current[boxIndex].leftX = //
      fingerX - objectRef.current[boxIndex].lenX / 2;
    objectRef.current[boxIndex].topY =
      fingerY - objectRef.current[boxIndex].lenY / 2;
    /* 점수를 위한 object x,y 위치 */
    const objX = objectRef.current[boxIndex].leftX;
    const objY = objectRef.current[boxIndex].topY;

    if (
      objX >= conX - 0.06 &&
      objX <= conX + 0.01 &&
      objY <= conY + 0.04 &&
      objY >= conY - 0.1
    ) {
      objectRef.current[boxIndex].leftX = 0.75;

      if (objectRef.current[boxIndex].type === "beer") {
        console.log("beer");
        objectRef.current[boxIndex].topY = 0.05;
      } else if (objectRef.current[boxIndex].type === "soju") {
        console.log("soju");
        objectRef.current[boxIndex].topY = 0.5;
      } else if (objectRef.current[boxIndex].type === "mak") {
        console.log("mak");
        objectRef.current[boxIndex].topY = 0.28;
      } else {
        console.log("cider");
        objectRef.current[boxIndex].topY = 0.73;
      }

      /* order 안에 있는 음료가 제대로 들어왔을 경우 배열 하나 줄여주고, 아닐경우 무시 */
      let index = order.indexOf(objectRef.current[boxIndex].type);
      if (index !== -1) {
        // 있을경우
        order.splice(index, 1);
        inBucket.push(objectRef.current[boxIndex]);

        effectSound(somaekSuccess, false, 1);

        images.madam = "../../Madam/madam2.png";
      } else {
        //없을경우
        effectSound(somaekFail, false, 1);
        console.log("주문한 음료가 아님");
        images.madam = "../../Madam/madam1.png";
      }
      if (order.length === 0) {
        order = randomDrink();
        score += 1;
        sendScoreSignal(score);
        console.log("score = ", score);
        orderKorean = ["감사합니다!!"];
        /* 버킷에 모든음료가 채워졌을 경우, 0.8초보여주고 사라짐 */
        setTimeout(() => {
          inBucket = [];
          orderKorean = printDrinks(order);
          images.madam = "../../Madam/madam3.png";
        }, 800);
      }
      console.log(order);
    }
  };

  const objDrag = (landmarks, canvasRef) => {
    let { distance, fingerPick } = fingerDistance(landmarks);
    if (distance > 0.01) return;
    for (let boxIndex = 0; boxIndex < objectRef.current.length; boxIndex++) {
      const {
        leftX: objLeftX,
        topY: objTopY,
        lenX: objXLength,
        lenY: objYLength,
      } = objectRef.current[boxIndex];
      const { x: fingerX, y: fingerY, z: _ } = fingerPick;

      const boxSize = 0.12;

      if (
        objLeftX + objXLength * (1 / 2 - boxSize) < fingerX &&
        fingerX < objLeftX + objXLength * (1 / 2 + boxSize) &&
        objTopY + objYLength * (1 / 2 - boxSize) < fingerY &&
        fingerY < objTopY + objYLength * (1 / 2 + boxSize)
      ) {
        objMove(fingerPick, boxIndex);
        return;
      }
    }
  };

  //손가락 사이의 거리를 계산하는 함수
  const fingerDistance = (landmarks) => {
    // 손 크기 기준 좌표
    const { x: zeroX, y: zeroY, z: zeroZ } = landmarks[0];
    const { x: fifthX, y: fifthY, z: fifthZ } = landmarks[5];
    const { x: lastX, y: lastY, z: lastZ } = landmarks[17];
    // 엄지와 검지 끝 좌표
    const { x: umziX, y: umziY, z: umziZ } = landmarks[4];
    const { x: gumziX, y: gumziY, z: gumziZ } = landmarks[8];
    // 거리 계산
    const base =
      ((fifthX - zeroX) ** 2 +
        (fifthY - zeroY) ** 2 +
        (fifthZ - zeroZ) ** 2 +
        (fifthX - lastX) ** 2 +
        (fifthY - lastY) ** 2 +
        (fifthZ - lastZ) ** 2 +
        (lastX - zeroX) ** 2 +
        (lastY - zeroY) ** 2 +
        (lastZ - zeroZ) ** 2) **
      0.5;
    const distance =
      (umziX - gumziX) ** 2 + (umziY - gumziY) ** 2 + (umziZ - gumziZ) ** 2;

    /* 0.11이랑 0.1을 더한건, 이미지를 줄여서 나온 유격 조정*/
    return {
      distance: distance / base,
      fingerPick: {
        x: (umziX + gumziX) / 2 + 0.11,
        y: (umziY + gumziY) / 2 + 0.1,
      },
    };
  };

  function randomDrink() {
    let drinks = [];
    let randomCount = 1 + Math.floor(Math.random() * 4);
    for (let i = 0; i < randomCount; i++) {
      let randomValue = Math.random();
      if (randomValue < 0.1) drinks.push("cider");
      else if (randomValue < 0.4) drinks.push("soju");
      else if (randomValue < 0.7) drinks.push("mak");
      else drinks.push("beer");
    }
    return drinks;
  }

  /* {soju, beer, beer} 를 {소주1병,맥주2병} 으로 바꾸는 함수 */
  function printDrinks(drinks) {
    // 요소의 빈도를 저장하는 Map을 생성
    const drinkCount = new Map();

    // 각 요소에 대해
    
    drinks.forEach((drink) => {
      // 현재 요소의 빈도를 가져옴 (없으면 0)
      const currentCount = drinkCount.get(drink) || 0;
      // 현재 요소의 빈도를 1 증가시킴
      drinkCount.set(drink, currentCount + 1);
    });
    let drinkPrintList = [];

    // Map을 순회하며 결과를 출력
    drinkCount.forEach((count, drink) => {
      // 빈도가 0인 요소는 제외
      if (count > 0) {
        let koreanDrink;
        switch (drink) {
          case "soju":
            koreanDrink = "소주";
            break;
          case "beer":
            koreanDrink = "맥주";
            break;
          case "mak":
            koreanDrink = "막걸리";
            break;
          case "cider":
            koreanDrink = "사이다";
            break;
          default:
            koreanDrink = drink;
        }
        drinkPrintList.push(`${koreanDrink} ${count}병`);
      }
    });
    console.log(drinkPrintList);
    return drinkPrintList;
  }






/*======================================================= */  
/*===================시그널 관련=================== */  
/*======================================================= */  

  /* 시그널 받는 부분 */
  useEffect(() => {
    const videoNode = videoRef.current;
    const canvasNode = canvasRef.current;
    if (order.length === 0) {
      order = randomDrink();
      orderKorean = printDrinks(order);
      console.log(order);
    }

    const handleLoaded = () => {
      if (videoNode && canvasNode) {
        setTimeout(() => {
          setLoaded(true);
          sendReadySignal();
        }, 5000);
      }
    };

    if (videoNode) {
      videoNode.addEventListener("loadeddata", handleLoaded);
    }
    if (canvasNode) {
      handleLoaded();
    }

    /* 시그널 받았을때 처리 */
    props.user
      .getStreamManager()
      .stream.session.on("signal:somaekScore", (event) => {
        const data = JSON.parse(event.data);
        let connectionId = event.from.connectionId;
        let getScore = data.score;

        /* 먼저 그 점수에 도달한 사람이 있으면 0.1을 깎아서 저장 */
        while (Object.values(scores.current).includes(getScore)) {
          getScore -= 0.1;
          getScore = Math.round(getScore * 10) / 10; // 자바스크립트 부동소수점 오류잡으려면 이런식으로 하라는데?
        }

        scores.current[props.conToNick[connectionId]] = getScore;
      });

    props.user
      .getStreamManager()
      .stream.session.on("signal:somaekState", (event) => {
        const data = JSON.parse(event.data);
        let connectionId = event.from.connectionId;
        let getState = data.state;
        states[connectionId] = getState;
        console.log(states);
      });

    /* 내가 호스트일 경우에만, session on 함  */
    if (
      props.user.getStreamManager().stream.connection.connectionId === hostId
    ) {
      let readyPeople = [];
      props.user
        .getStreamManager()
        .stream.session.on("signal:readySignal", (event) => {
          let fromId = event.from.connectionId;
          if (!readyPeople.includes(fromId)) {
            readyPeople.push(fromId);
          }

          if (readyPeople.length === subscribers.length + 1) {
            console.log("받았다!!!");
            sendStartSignal();
            props.user
              .getStreamManager()
              .stream.session.off("signal:readySignal");
          }
        });
    }

    /* start 시그널 받는 session on !! */
    props.user
      .getStreamManager()
      .stream.session.on("signal:startSignal", (event) => {
        setCountDown(true);
        /* 3초후에 스타트로 바뀜!*/
        setTimeout(() => {
          setCountDown(false);
          setTimeout(() => {
            setStart(true);
          }, 300);
        }, 3000);
      });

    return () => {
      // didCancel = true;
      props.user.getStreamManager().stream.session.off("signal:somaekScore");
      if (videoNode) {
        videoNode.removeEventListener("loadeddata", handleLoaded);
      }
    };
  }, [videoRef.current, canvasRef.current]);



  /*게임 로드 후 레디 시그널 전송 */
  const sendReadySignal = () => {
    props.user
      .getStreamManager()
      .session.signal({
        to: [],
        type: "readySignal",
      })
      .then(() => {
        console.log("readySignal successfully sent");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /*게임 시작 시그널 전송*/
  const sendStartSignal = () => {
    props.user
      .getStreamManager()
      .session.signal({
        to: [],
        type: "startSignal",
      })
      .then(() => {
        console.log("startSignal successfully sent");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /* 게임 진행 상태 전송 */
  const sendStateSignal = (score) => {
    if (props.user.getStreamManager().session) {
      const data = {
        streamId: props.user.getStreamManager().stream.streamId,
        state: objectRef.current,
      };
      props.user
        .getStreamManager()
        .session.signal({
          data: JSON.stringify(data),
          to: [],
          type: "somaekState",
        })
        .then(() => {
          console.log("stateSignal successfully sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  /* 게임 결과 전송 */
  const sendScoreSignal = (score) => {
    if (props.user.getStreamManager().session) {
      const data = {
        score: score,
        streamId: props.user.getStreamManager().stream.streamId,
      };
      props.user
        .getStreamManager()
        .session.signal({
          data: JSON.stringify(data),
          to: [],
          type: "somaekScore",
        })
        .then(() => {
          console.log("Message successfully sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };


/*======================================================= */  
/*=================== return =================== */  
/*======================================================= */  

  return (
    <>
      <div>
        {props.mode === "somaek" && !loaded && (
          <div>
            <Loading mode={props.mode}/>
          </div>
        )}
        {props.mode === "somaek" && countDown && (
          <div>
            <CountDown />
          </div>
        )}
        {props.mode === "somaek" && !isGameOver ? (
          <>
            <span className={!loaded ? styles.hidden : ""}>
              {loaded ? null : "소맥"}
            </span>
            <video
              className={`${styles.somaekVideo} ${!loaded && styles.hidden}`}
              autoPlay={true}
              ref={videoRef}
            />

            <canvas
              className={`${styles.somaekCanvas} ${!start && styles.hidden}`}
              ref={canvasRef}
              width={"1920px"}
              height={"1080px"}
            />
            {/* subscribers Cam */}
            {subscribers.map((subscriber, index) => (
              <>
                <div
                  className={`${styles[`somaekGameSub${index + 1}`]} ${
                    !loaded && styles.hidden
                  }`}
                >
                  <OpenViduVideoComponent
                    mode={"somaek"}
                    streamManager={subscriber}
                    drawGame={loadImages}
                    gameState={states}
                  />
                </div>
                <div
                  className={`${styles[`userNick${index + 1}`]} ${
                    !loaded && styles.hidden
                  }`}
                >
                  닉네임 :
                  {props.conToNick[subscriber.stream.connection.connectionId]}
                </div>
              </>
            ))}
          </>
        ) : (
          <div>
            <LoserCam
              selectId={lowestConId}
              user={props.user}
              mode={"centerCam"}
              end={props.end}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Somaek;
