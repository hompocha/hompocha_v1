
import React, {useEffect, useRef, useState} from "react";
import Loading from "../../Loading/Loading";
import styles from "../DuckCatching/DuckVideo.module.css";
import {Camera} from "@mediapipe/camera_utils"
import {Hands, VERSION} from "@mediapipe/hands";

const Somaek = (props) => {
  const [loaded, setLoaded] = useState(true);
  const [pickObj, setPickObj] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);

  let objects = [
    {leftX: 0.75, topY: 0.05, lenX:0.5, lenY: 0.5, type:'beer'},
    {leftX: 0.75, topY: 0.28, lenX:0.5, lenY: 0.5, type:'mak'},
    {leftX: 0.75, topY:0.5, lenX:0.5, lenY: 0.5, type:'soju'},
    {leftX: 0.75, topY: 0.73, lenX:0.5, lenY: 0.5, type:'cider'},
  ];
  const container = {leftX: 0.15, topY: 0.4, lenX:0.2, lenY: 0.2, type:'cup', movable: false};
  const conX = container.leftX;//*1280;
  const conY = container.topY;//*720;
  // objects.push(newBox);
  let score = 0;
  let order = []


  useEffect(() => {
    if(order.length === 0) {
      order = randomDrink();
      console.log(order);
    }
    let didCancel = false;

    const loadHandsAndCamera = async () => {
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
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
          width: 1280,
          height: 720,
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
  }, [canvasRef.current]);

  const canvasWidth = 1280;
  const canvasHeight = 720;


  /* on Results */
  const onResults = (results) => {

    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        const classification = results.multiHandedness[index];
        const landmarks = results.multiHandLandmarks[index];

        objDrag(landmarks, canvasRef);
      }

    }
    /* 물체를 그리는 부분 */
    const images = {
      'soju': '../../Drink/soju.png',
      'beer': '../../Drink/beer.png',
      'mak': '../../Drink/mak.png',
      'container':'../../Drink/empty.png',
      'cider': '../../beer2.png'
      // 필요한 이미지를 계속 추가할 수 있습니다.
    };
    let currentImageIndex = 0;
    const imgElements = [];

    const drawSoju = () => {
      // if(!isMounted) return;
      if(!canvasRef.current) return;
      canvasCtx.current.clearRect(0, 0, canvasCtx.current.canvas.width, canvasCtx.current.canvas.height);

      for (let i = 0; i < objects.length; i++) {
        let boxLocation = objects[i];
        const img = imgElements[boxLocation.type];  // type에 따른 이미지 선택
        canvasCtx.current.drawImage(
          img,
          boxLocation.leftX * canvasWidth,
          boxLocation.topY * canvasHeight,
          boxLocation.lenX * canvasWidth*0.5,
          boxLocation.lenY * canvasHeight*0.5
        );

      }
      canvasCtx.current.drawImage(
        imgElements['container'],
        container.leftX * canvasWidth,
        container.topY * canvasHeight,
        container.lenX * canvasWidth,
        container.lenY * canvasHeight,
      )
      // canvasCtx.current.fillRect(
      //   container.leftX * canvasWidth,
      //   container.topY * canvasHeight,
      //   container.lenX * canvasWidth,
      //   container.lenY * canvasHeight,
      //   // 0,
      //   // 0,
      //   // canvasWidth,
      //   // canvasHeight,
      // );

    };
    const loadImages = async () => {
      try {
        for (let type in images) {
          const img = new Image();
          img.src = images[type];
          // 이미지 로딩을 Promise로 감싸 비동기로 처리
          await new Promise((resolve) => {
            img.onload = () => resolve();
          });
          imgElements[type] = img;
        }
        // 모든 이미지 로딩이 완료되면 애니메이션 시작
        drawSoju();
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
    canvasCtx.current.restore();

  };

  const objMove = (fingerpick, boxIndex) => {
    if(!canvasRef) return;

    const {x: fingerX, y: fingerY, z:_} = fingerpick;
    objects[boxIndex].leftX= fingerX - objects[boxIndex].lenX /2;
    objects[boxIndex].topY = fingerY - objects[boxIndex].lenY /2;
    /* 점수를 위한 object x,y 위치 */
    const objX = objects[boxIndex].leftX;
    const objY = objects[boxIndex].topY;



    if(objX >= (conX-0.06) && objX <= (conX+0.01)
      && objY <= (conY+0.04) && objY >= (conY-0.1)) {
      objects[boxIndex].leftX = 0.75;

      if(objects[boxIndex].type === 'beer') {
        console.log("beer");
        objects[boxIndex].topY = 0.05;
      }
      else if(objects[boxIndex].type === 'soju') {
        console.log("soju");
        objects[boxIndex].topY = 0.5;
      }
      else if(objects[boxIndex].type === 'mak'){
        console.log('mak');
        objects[boxIndex].topY = 0.28;
      }
      else{
        console.log('cider');
        objects[boxIndex].topY = 0.73;
      }
      order.splice(order.indexOf(objects[boxIndex].type), order.indexOf(objects[boxIndex].type) !== -1 ? 1 : 0);

      if(order.length === 0){
        order=randomDrink();
        score+=1;
        console.log("score = ",score);
      }
      console.log(order);
    }
  }

  const objDrag = (landmarks, canvasRef) => {
    let {distance, fingerPick} = fingerDistance(landmarks);

    if (distance > 0.01 ) {setPickObj(false); return;}

    for(let boxIndex = 0; boxIndex < objects.length; boxIndex++){
      const {leftX: objLeftX, topY: objTopY, lenX:objXLength, lenY: objYLength} = objects[boxIndex];
      const {x: fingerX, y: fingerY, z:_} = fingerPick;

      const boxsize=0.12;


      if (objLeftX+objXLength*(1/2-boxsize) < fingerX && fingerX< (objLeftX+objXLength*(1/2+boxsize))
        && objTopY+objYLength*(1/2-boxsize) < fingerY && fingerY< objTopY+objYLength*(1/2+boxsize)){
        objMove(fingerPick, boxIndex);
        setPickObj(true);
        return;
      }
    }
    setPickObj(false);
  }

  //손가락 사이의 거리를 계산하는 함수
  const fingerDistance = (landmarks) => {
    // 손 크기 기준 좌표
    const {x:zeroX, y:zeroY, z:zeroZ} = landmarks[0];
    const {x:fifthX, y:fifthY, z:fifthZ} = landmarks[5];
    const {x:lastX, y:lastY, z:lastZ} = landmarks[17];
    // 엄지와 검지 끝 좌표
    const {x:umziX, y:umziY, z:umziZ} = landmarks[4];
    const {x:gumziX, y:gumziY, z:gumziZ} = landmarks[8];
    // 거리 계산
    const base = ((fifthX-zeroX)**2 +(fifthY-zeroY)**2 +(fifthZ-zeroZ)**2
      + (fifthX-lastX)**2 +(fifthY-lastY)**2 +(fifthZ-lastZ)**2
      + (lastX-zeroX)**2 +(lastY-zeroY)**2 +(lastZ-zeroZ)**2)**0.5;
    const distance = (umziX-gumziX)**2 +(umziY-gumziY)**2 +(umziZ-gumziZ)**2;

    /* 0.11이랑 0.1을 더한건, 이미지를 줄여서 나온 유격 조정*/
    return {distance: distance/base, fingerPick:{x:(umziX+gumziX)/2+0.11, y:(umziY+gumziY)/2+0.1}};
  }

  function randomDrink(){
    let drinks = []
    let randomCount = 1+Math.floor(Math.random()*5);
    for(let i = 0;i<randomCount;i++){
      let randomValue = Math.random();
      if(randomValue <0.1)
        drinks.push("cider");
      else if(randomValue<0.4)
        drinks.push("soju");
      else if(randomValue<0.7)
        drinks.push("mak");
      else
        drinks.push("beer");
    }
    return drinks;
  }




  return (
    <>
      <div>
        {props.mode === "somaek" && !loaded && <div> <Loading/> </div>}
        {props.mode === "somaek" ? (
          <div>
                  <span className={!loaded ? styles.hidden : ''}>
                    {loaded ? null : '소맥'}
                  </span>
            <video
              className={`${styles.videoCanvas} ${!loaded && styles.hidden}`}
              autoPlay={true}
              ref={videoRef}
            />

            <canvas className={styles.duckCanvas} ref={canvasRef}  width={1280} height={720}/>
          </div>
        ) : null}

      </div>
    </>
  );
}

export default Somaek;
