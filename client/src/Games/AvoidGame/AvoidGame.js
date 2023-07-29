import { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Results, Hands, VERSION } from "@mediapipe/hands";
import styles from "../AirHockey/Airhockey.module.css";

 function newObj (src, width, height) {
  this.position = {x:0, y:0};
  this.nextPosition = {x:0, y:0};
  // this.image = new Image();
  // this.image.src = src;
  this.width = width;
  this.height = height;
  this.isAvoid = true;
}

/* 초기 게임 세팅*/
const defaultGameState = {
  roomId: 'room',
  user: 'connectionId',
  condition: {
    objDropHeight:0.08,
    ground: 0.8,
    objSpeed:0.05,
    objIntervalFrame:10,
    defaultTime:1000*60,
  },
  hpBar: {
    length: 0.8,
    height: 0.05,
    location: {x: 0.1, y: 0.02}
  },
  player:
    {
      position: {x:0.5, y:0.95},
      nextPosition: {x:0.5, y:0.95},
      width: 0.05,
      height: 0.07,
      img: new Image(),
      img_src: undefined
    }
  ,
  objects:[],
}


const AvoidGame = (props) => {
  const myConnectionId = props.user.connectionId;
  const [videoReady, setVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);
  const gameState = useRef(defaultGameState);
  const objInterval = useRef(null);
  const speedInterval = useRef(null);
  const [gameEnd, setGameEnd] = useState(null);
  const hpLeft = useRef(100);


  /* 데이터 수신해서 반영 */
  useEffect(() => {
    if(props.sessionConnected)
      {
      }
  }, [props.sessionConnected]);
  
  /* 비디오 시작 시 - 손 인식 시작 */
  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
    const hands = new Hands({
      locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
    });
    
      canvasCtx.current = canvasRef.current.getContext("2d");
      
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 960,
        height: 720,
      });
      camera.start();
    }
  }, [videoReady]);
  
  /* 손 위치 인식 + 패들 위치 업데이트 + 패들 캔버스에 그림 */
  const onResults = (results) => {
    if (canvasRef.current && canvasCtx.current) {
      setLoaded(true);
    }

    /* 패들 위치 감지 */
    if (results.multiHandLandmarks && results.multiHandedness) {
      if (results.multiHandLandmarks[0] && results.multiHandLandmarks[0][8]) {
          let finger = results.multiHandLandmarks[0][8].x;
          if (finger > 0.98) {
            gameState.current.player.position.x = 0.98;
          }
          else if (finger < 0.02) {
            gameState.current.player.position.x = 0.02;
          }else{
          gameState.current.player.position.x = finger;}
      }
    }

    /* 공 및 패들 위치 업데이트 */
    updateGameState(canvasRef.current, gameState.current);
    /* 공 및 패들 캔버스에 그리기*/
    drawGame(canvasRef.current, canvasCtx.current, gameState.current);
  };


  /* 프레임마다 전송 */
  useEffect(()=>{
    // console.log(props.user.connectionId, props.host);
    // if (props.user.connectionId === props.host ){
    //   console.log('I am the host!');
    // }
    canvasCtx.current = canvasRef.current.getContext("2d");
    objInterval.current = setObjInterval(1000/gameState.current.condition.objIntervalFrame);

    speedInterval.current = setInterval(() => {
      clearInterval(objInterval.current);
      gameState.current.condition.objIntervalFrame+=5;
      objInterval.current = setObjInterval(1000/gameState.current.condition.objIntervalFrame);
    }, 7*1000);

    return (()=>{
      clearInterval(objInterval.current);
      clearInterval(speedInterval.current);
      });
  },[]);
    

  const setObjInterval=(time)=>{
    return setInterval(() => {
    
      const obj = new newObj();
      if (Math.random() < 0.15){
        obj.isAvoid = false;
      }
      obj.position.y = gameState.current.condition.objDropHeight;
      obj.position.x = Math.random();
      gameState.current.objects.push(obj);
      
    }, time);
  }
  /* 전체 게임을 그림 */
  const drawGame = (can_ref, can_ctx, gameState) => {
    const w = can_ref.width;
    const h = can_ref.height;
    can_ctx.save();
    can_ctx.clearRect(0, 0, w, h);
    drawPlayer(can_ref, can_ctx, gameState.player);
    
    gameState.objects.forEach((obj)=>{
        drawObj(can_ref, can_ctx, obj);
    });
   
    drawHpBar(can_ref, can_ctx, hpLeft.current);
    can_ctx.restore();
  };

  /* 플레이어를 그림 */
  const drawPlayer = (can_ref, can_ctx, player) => {
    const w = can_ref.width;
    const h = can_ref.height;
    can_ctx.fillStyle="lime";
    can_ctx.fillRect((player.position.x-player.width/2)*w,
       (player.position.y-player.height/2)*h, 
       player.width*w, player.height*h);
  }

  /* 오브젝트 그림 */
  const drawObj = (can_ref, can_ctx, obj) => {
    const w = can_ref.width;
    const h = can_ref.height;

    can_ctx.beginPath();
    can_ctx.fillStyle=(obj.isAvoid)?"red":"green";
    can_ctx.arc(obj.position.x*w, obj.position.y*h, 4, 0, 2*Math.PI);
    can_ctx.fill();
    can_ctx.closePath();
  }

  const drawHpBar = (can_ref, can_ctx, hp) => {
    const w = can_ref.width;
    const h = can_ref.height;
    can_ctx.fillStyle=(hp>30)? "lime":"yellow";
    can_ctx.fillRect(gameState.current.hpBar.location.x*w,
      gameState.current.hpBar.location.y*h, 
       (hp/100 * gameState.current.hpBar.length)*w, gameState.current.hpBar.height*h);
  }

  /* 받은 데이터 기반으로 전체 게임 state 업데이트 */
  const updateGameState = (can_ref, gameState) => {
    const w = can_ref.width;
    const h = can_ref.height;

    /* obj 위치 업데이트 */
    for(let i=0; i < gameState.objects.length ; i++)
    {
      let obj = gameState.objects[i];
      if (((obj.position.y + gameState.condition.objSpeed) > gameState.player.position.y - gameState.player.height/2
         )
        &&((obj.position.x) > gameState.player.position.x - gameState.player.width/2
        && (obj.position.x) < gameState.player.position.x + gameState.player.width/2 )){
          if (obj.isAvoid)
          {
            console.log("diediediediediediediediediediediedie", hpLeft.current);
            hpLeft.current-=3;
            if(hpLeft.current<0) {
              setGameEnd(true);
              gameState.objects=[];
              clearInterval(objInterval.current);
              clearInterval(speedInterval.current);
            }
          }else {
            console.log(obj.isAvoid, "yumyumyumyumyumyumyumyumyumyumyumyum", hpLeft.current);
            hpLeft.current+=10;
          }
          gameState.objects.splice(i,1);
        }
      obj.position.y = obj.position.y + gameState.condition.objSpeed;
    }
  }

  /* 마스터 플레이어라면 공의 위치 계산 */
  const calculateObj = (can_ref, nextState) => {
    const w = can_ref.width;
    const h = can_ref.height;
    nextState.balls.forEach((ball) => {
      if ((ball.position.x + ball.speed.dx)*w > w - ball.radius/2 
        || (ball.position.x + ball.speed.dx)*w < ball.radius/2){
        ball.speed.dx = -ball.speed.dx;
      }
      if ((ball.position.y + ball.speed.dy)*h > h - ball.radius/2
        || (ball.position.y + ball.speed.dy)*h < ball.radius/2 ){
        ball.speed.dy = -ball.speed.dy;
      }

      nextState.players.forEach((player)=>{
        if (((ball.position.y + ball.speed.dy) > player.nextPosition.y - nextState.paddle.height/2
        && (ball.position.y + ball.speed.dy) < player.nextPosition.y + nextState.paddle.height/2 )
        &&((ball.position.x + ball.speed.dx) > player.nextPosition.x - nextState.paddle.width/2
        && (ball.position.x + ball.speed.dx) < player.nextPosition.x + nextState.paddle.width/2 )){
          ball.speed.dx = -ball.speed.dx;
        }
      })

      ball.nextPosition.x += ball.speed.dx;
      ball.nextPosition.y += ball.speed.dy;
    })
  }
    return (
      <>
        {(props.user.connectionId === props.host )? <h1>host</h1>:null}
        <video
          className={styles.webcamRef}
          autoPlay={true}
          ref={(el) => {
            videoRef.current = el;
            setVideoReady(el);
          }}
          />
        <canvas 
          className={styles.webcamRefz}
           ref={canvasRef} />
      </>
    );
    
  }
  
  export {AvoidGame};
  
  
