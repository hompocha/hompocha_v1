import React, { useEffect, useRef, useState } from "react";
import { Results, Hands, HAND_CONNECTIONS, VERSION } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks, Data, lerp,} from "@mediapipe/drawing_utils";
import styles from "./DuckVideo.module.css";
import {Camera} from "@mediapipe/camera_utils"
import DuckCanvas from "./Duck";

const DuckVideo = (props) => {
    const [videoReady, setVideoReady] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [pickObj, setPickObj] = useState();

    //   console.log(props.state.mode);
    //   console.log(props.streamManager);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasCtx = useRef(null);


    //사각형 오브젝트의 위치와 크기 설정
    let boxLocation = {leftX: 0.1, topY: 0.1, lenX:0.5, lenY: 0.5};


    // 손의 움직임과 관련된 처리를 수행
    useEffect(()=>{
        if(pickObj===false) {
        const interval = setInterval(()=>{
            boxLocation.topY=boxLocation.topY + 0.1;    
            // console.log(boxLocation.topY);
            console.log(2);
        },1);
        setTimeout(()=>{clearInterval(interval);},1000);  
        }
    },[pickObj]);

    
    useEffect(() => {
        // console.log(videoRef.current);
        if (videoRef.current && props.streamManager) {
        props.streamManager.addVideoElement(videoRef.current);
        }
    }, [props.streamManager]);

    useEffect(() => {
        const hands = new Hands({
        locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
        });
        

        if (videoRef.current && canvasRef.current) {
        canvasCtx.current = canvasRef.current.getContext("2d");
        console.log(`canvasCtx.current : ${canvasCtx.current}`);
        // setTimeout(sendToMediaPipe, 3000);
        
        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });
        
        hands.onResults(onResults);

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
            await hands.send({image: videoRef.current});
            },
            width: 1280,
            height: 720
        });
        camera.start();
        }

        
    }, [videoReady]);

    //MediaPipe Hands 결과를 처리하고 화면에 출력하는 함수
    const onResults = (results) => {
        if (canvasRef.current && canvasCtx.current) {
            setLoaded(true);
        }
        
        canvasCtx.current.save();
        canvasCtx.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );
        
        canvasCtx.current.drawImage(
            results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
        );
            
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        
        if (results.multiHandLandmarks && results.multiHandedness) {
            for (let index = 0; index < results.multiHandLandmarks.length; index++) {
                const classification = results.multiHandedness[index];
                const isRightHand = classification.label === "Right";
                const landmarks = results.multiHandLandmarks[index];
                
                drawConnectors(canvasCtx.current, landmarks, HAND_CONNECTIONS, {
                    color: isRightHand ? "#00FF00" : "#FF0000",
                });
                
                drawLandmarks(canvasCtx.current, landmarks, {
                    color: isRightHand ? "#00FF00" : "#FF0000",
                    fillColor: isRightHand ? "#FF0000" : "#00FF00",
                    radius: (data) => {
                        return lerp(data.from.z, -0.15, 0.1, 10, 1);
                    },
                });
                
                objDrag(landmarks, canvasRef);
            }
            
        }
        // 물체를 그리는 부분
        const images = ['/Duck/moving_duck1.png', '/Duck/moving_duck2.png', '/Duck/moving_duck3.png'];
        let currentImageIndex = 0;
        const imgElements = [];
        
        const drawDuck = () => {
            canvasCtx.current.clearRect(0, 0, canvasCtx.current.canvas.width, canvasCtx.current.canvas.height);
            canvasCtx.current.drawImage(
                imgElements[currentImageIndex],
                boxLocation.leftX * w,
                boxLocation.topY * h,
                boxLocation.lenX * w,
                boxLocation.lenY * h
                );
            // setTimeout(() => {
                currentImageIndex = (currentImageIndex + 1) % imgElements.length;
                requestAnimationFrame(drawDuck);
            // }, 10000);
        };
        const loadImages = async () => {
            try {
                for (let i = 0; i < images.length; i++) {
                    const img = new Image();
                    img.src = images[i];
                    // 이미지 로딩을 Promise로 감싸 비동기로 처리
                    await new Promise((resolve) => {
                        img.onload = () => resolve();
                    });
                    imgElements.push(img);
                }
                // 모든 이미지 로딩이 완료되면 애니메이션 시작
                drawDuck();
            } catch (error) {
                console.error("Error loading images:", error);
            }
        };
    
        loadImages();
        canvasCtx.current.restore();
    };
    const [blue, setBlue] = useState(0);
    const [red, setRed] = useState(0);
    // 사각형 오브젝트를 드래그하는 함수
    const objMove = (fingerpick) => {
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        const {x: fingerX, y: fingerY, z:_} = fingerpick;
    
        boxLocation.leftX = fingerX - boxLocation.lenX / 2;
        boxLocation.topY = fingerY - boxLocation.lenY / 2;
    
        const xPos = boxLocation.leftX + boxLocation.lenX / 2;
        const yPos = boxLocation.topY + boxLocation.lenY / 2;
        
        if (xPos >= 0 && xPos <= (w/2) && yPos >= 0 && yPos <= h) {
            setBlue(1);
            setRed(0);
        } else if (xPos >= (w/2 + 1) && xPos <= w && yPos >= 0 && yPos <= h) {
            setBlue(0);
            setRed(1);
        }
    }

    //손가락의 위치를 기반으로 사각형 오브젝트를 드래그하는 함수
    const objDrag = (landmarks, canvasRef) => {
        let {distance, fingerPick} = fingerDistance(landmarks);
        if (distance > 0.01 ) {setPickObj(false); return;}

        const {leftX: objLeftX, topY: objTopY, lenX:objXLength, lenY: objYLength} = boxLocation;
        const {x: fingerX, y: fingerY, z:_} = fingerPick;
        
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        const boxsize=0.12;
        
        if (objLeftX+objXLength*(1/2-boxsize) < fingerX && fingerX< (objLeftX+objXLength*(1/2+boxsize)) 
            && objTopY+objYLength*(1/2-boxsize) < fingerY && fingerY< objTopY+objYLength*(1/2+boxsize)){
        objMove(fingerPick);
        setPickObj(true);
        return;
        }
        // if(pickObj===true){
        setPickObj(false);
        // }
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
        return {distance: distance/base, fingerPick:{x:(umziX+gumziX)/2, y:(umziY+gumziY)/2}};
    }

    return (
        <>
        {props.state.mode === "movingDuck" ? (
            <div>
            <span>오리 옮기기 모드</span>
            <video
                className={styles.videoCanvas}
                autoPlay={true}
                ref={(el) => {
                    videoRef.current = el;
                    setVideoReady(!!el);
                }}
            />
            <canvas className={styles.duckCanvas} ref={canvasRef} width={800} height={700} />
            <h2 className= {styles.bord}> blue {blue} : {red} red </h2>
            </div>
        ) : null}
        </>
    );
};


export default DuckVideo;
