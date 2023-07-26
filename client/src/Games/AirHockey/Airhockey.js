import { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Results, Hands, HAND_CONNECTIONS, VERSION } from "@mediapipe/hands";
import { drawPaddle } from "./drawPaddle";
// import styles from "../GameCam.module.css";
import styles from "./Airhockey.module.css";


const defaultGameState = {
  paddle: {
    width: 0.04,
    height:0.2,
  },
  // players: [
  //   {
  //     playerId: 'player1',
  //     connectionId: undefined,
  //     position: {x:0.2, y:0.5},
  //     nextPosition: {x:0.2, y:0.5}
  //   },
  //   {
  //     playerId: 'player2',
  //     connectionId: undefined,
  //     position: {x:0.2, y:0.5},
  //     nextPosition: {x:0.2, y:0.5}
  //   }
  // ],
  player1: {
    playerId: 'player1',
    position: {x:0.2, y:0.5},
    nextPosition: {x:0.2, y:0.5}
  },
  // player2: {
  //   playerId: 'player2',
  //   position: {x:0.8, y:0.5},
  //   nextPosition: {x:0, y:0}
  // },
  balls: [
    {
      radius: 4,
      position: {x:0.5, y:0.5},
      speed: {dx:0.02, dy:0.02},
      nextPosition:{x:0.5, y:0.5}
    },
    {
      radius: 4,
      position: {x:0.5, y:0.5},
      speed: {dx:0.02, dy:-0.02},
      nextPosition:{x:0.5, y:0.5}
    }
  ],
  roomId: 'room'
}



const Airhockey = (props) => {
  const [videoReady, setVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // const [user, setUser] = useState(null);
  // const [gameState, setGameState] = useState();
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);
  const padleLoc = useRef(null);
  const gameState = useRef(defaultGameState);

  
  // useEffect(() => {
  //   if (videoRef.current && props.streamManager) {
  //     console.log('set');
  //     props.streamManager.addVideoElement(videoRef.current);
  //     // user=props.user;
  //   }
  // }, [props.streamManager]);

  useEffect(() => {
    if(props.sessionConnected)
      {
        props.user.getStreamManager().stream.session.on('signal:airhockey', (event) => {
          const data= JSON.parse(event.data);

          // if(gameState.current.player1.playerId == props.user.connectionId){
          //   console.log()
            gameState.current.player1.nextPosition.x=data.x;
            gameState.current.player1.nextPosition.y=data.y;
          // }
          // else {
          //   gameState.current.player2.nextPosition.x=data.x;
          //   gameState.current.player2.nextPosition.y=data.y;
          // }
        });
      }
  }, [props.sessionConnected]);
  
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
    });
    
    if (videoRef.current && canvasRef.current) {
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
  
  const onResults = (results) => {
    if (canvasRef.current && canvasCtx.current) {
      setLoaded(true);
    }

    /* 패들 위치 감지 */
    if (results.multiHandLandmarks && results.multiHandedness) {
      if (results.multiHandLandmarks[0] && results.multiHandLandmarks[0][8]) {
          padleLoc.current = {user: props.user.getStreamManager().stream.connection.connectionId,
              x:results.multiHandLandmarks[0][8].x,
               y:results.multiHandLandmarks[0][8].y};
      }
    }
    // console.log(gameState.current.player1);

    /* 공 및 패들 계산 */
    // console.log(gameState.current.player1.move);
    // calculateBall();
    // updateGameState();
    updateGameState(canvasRef.current, gameState.current);

    /* 공 및 패들 캔버스에 그리기*/
    drawGame(canvasRef.current, canvasCtx.current, gameState.current);
  };


  
  // const [gameState, setGameState] = useState();
  // const [intervalId, setIntervalId] = useState();
  // setGameState(defaultGameState);

  useEffect(()=>{
      console.log('start');
      canvasCtx.current = canvasRef.current.getContext("2d");
      // gameState.current = defaultGameState;
      setInterval(() => {
        sendPadleLocation(padleLoc.current);
        // updateGameState();
      }, 1000/60);
  },[]);
    
  const sendPadleLocation = (PadleLocation) => {
    if (props.user){
      const padleLocString=JSON.stringify(PadleLocation);
      props.user.getStreamManager().session
          .signal({
            data: padleLocString,
            to: [],
            type: "airhockey",
          })
          .then(() => {
              console.log("Message successfully sent");
          })
          .catch((error) => {
              console.error(error);
          });
    }
  }

  const drawGame = (can_ref, can_ctx, gameState) => {
    const w = can_ref.width;
    const h = can_ref.height;
    can_ctx.save();
    can_ctx.clearRect(0, 0, w, h);
    drawPlayerPaddle(can_ref, can_ctx, gameState.player1, gameState.paddle);
    // gameState.players.forEach((player)=>{
    //   console.log(player);
    //   // drawPlayerPaddle(can_ref, can_ctx, player, gameState.paddle);
    // })
    
    gameState.balls.forEach((ball)=>{
        drawBall(can_ref, can_ctx, ball);
      });
    //   drawBall(can_ref, can_ctx, gameState.balls[0]);
   

    can_ctx.restore();
  };

  const drawPlayerPaddle = (can_ref, can_ctx, player, paddle) => {
    const w = can_ref.width;
    const h = can_ref.height;
    can_ctx.fillStyle="lime";
    can_ctx.fillRect((player.position.x-paddle.width/2)*w,
       (player.position.y-paddle.height/2)*h, 
       paddle.width*w, paddle.height*h);
  }

  const drawBall = (can_ref, can_ctx, ball) => {
    const w = can_ref.width;
    const h = can_ref.height;

    can_ctx.beginPath();
    can_ctx.fillStyle="yellow";
    can_ctx.arc(ball.position.x*w, ball.position.y*h, ball.radius, 0, 2*Math.PI);
    can_ctx.fill();
    can_ctx.closePath();
  }

  const updateGameState = (can_ref, gameState) => {
    const w = can_ref.width;
    const h = can_ref.height;
    gameState.player1.position.x = gameState.player1.nextPosition.x;
    gameState.player1.position.y = gameState.player1.nextPosition.y;

    gameState.balls.forEach((ball) => {
      if ((ball.position.x + ball.speed.dx)*w > w - ball.radius/2 
        || (ball.position.x + ball.speed.dx)*w < ball.radius/2){
        ball.speed.dx = -ball.speed.dx;
      }
      if ((ball.position.y + ball.speed.dy)*h > h - ball.radius/2
        || (ball.position.y + ball.speed.dy)*h < ball.radius/2 ){
        ball.speed.dy = -ball.speed.dy;
      }

      if (((ball.position.y + ball.speed.dy) > gameState.player1.nextPosition.y - gameState.paddle.height/2
      && (ball.position.y + ball.speed.dy) < gameState.player1.nextPosition.y + gameState.paddle.height/2 )
       &&((ball.position.x + ball.speed.dx) > gameState.player1.nextPosition.x - gameState.paddle.width/2
      && (ball.position.x + ball.speed.dx) < gameState.player1.nextPosition.x + gameState.paddle.width/2 )){
        ball.speed.dx = -ball.speed.dx;
      }

      ball.position.x += ball.speed.dx;
      ball.position.y += ball.speed.dy;
    })

  }
    return (
      <>
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
  
  export {Airhockey};
  
  

