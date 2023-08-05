import { useState, useRef, useEffect } from "react";
import UserVideoComponent from "./UserVideoComponent";
import styles from "./CamTest.module.scss";
import { event } from "jquery";
import BGM from "../sounds/roomBGM.wav";
import useSound from "../useSound";
import rouletteSound from "../sounds/rouletteEffect.wav";
import { effectSound } from "../effectSound";
import { Results, Hands, HAND_CONNECTIONS, VERSION } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";



const images:{[name:string]: string} = {
  // soju: "../../asset/game_img/soju.png",
  beer: "../../asset/cheers/beerForCheers2.png",
};

const CamTest = (props: any) => {
  /* 배경음악 */
  useSound(BGM, 1);
  interface Props {
    index: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    num: number;
    setVideoInfo: any;
  }
  const num = props.user.getSubscriber().length + 1;
  const svgRef = useRef<SVGSVGElement>(null);
  const [flag, setFlag] = useState(0);
  const [counts, setCounts] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [cheersMode, setCheersMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const videoInfosRef = useRef<{ [id: string]: any }>({});
  const myself = props.user.connectionId;
  const handData:{[id: string]: any}={};
  const imgElements:{[key: string]: HTMLImageElement} = {};


  /* 부채꼴 모양으로 자른 캠 */
  const CamSlice: React.FC<Props> = ({
    index,
    radius,
    startAngle,
    endAngle,
    num,
    setVideoInfo,
  }) => {
    const cx = radius;
    const cy = radius;

    const mode = props.user.mode;
    const publisher = props.user.getStreamManager();
    const subscribers = props.user.getSubscriber();
    const members = [publisher, ...subscribers];
    members.sort((a, b) => {
      return a.stream.connection.connectionId < b.stream.connection.connectionId
        ? -1
        : a.stream.connection.connectionId > b.stream.connection.connectionId
        ? 1
        : 0;
    });
    console.log(members);

    const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
    const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startAngleRad);
    const y1 = cy + radius * Math.sin(startAngleRad);
    const x2 = cx + radius * Math.cos(endAngleRad);
    const y2 = cy + radius * Math.sin(endAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const pathData = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    const videoClipId = `fan-clip-${index}`;
    console.log("받았음? " + (counts - 1));
    return (
      <g>
        <foreignObject
          width="100%"
          height="100%"
          clipPath={`url(#${videoClipId})`}
        >
          {flag === 0 && (
            <UserVideoComponent
              streamManager={members[index]}
              index={index}
              num={num}
              mode={mode}
              myself={myself}
              setVideoInfo={setVideoInfo}
            />
          )}
          {flag === 1 && (
            <UserVideoComponent
              streamManager={members[counts - 1]}
              index={1}
              num={num}
              mode="roulette"
              myself={myself}
              setVideoInfo={setVideoInfo}
            />
          )}
        </foreignObject>
        <clipPath key={videoClipId} id={videoClipId}>
          <path d={pathData} />;
        </clipPath>
      </g>
    );
  };

  /* 부채꼴 모양의 캠 array return */
  const renderCamSlices = (setVideoInfo: any) => {
    const angle = 360 / num - 0.01;
    const pieSlices = [];
    console.log(setVideoInfo);
    for (let i = 0; i < num; i++) {
      const startAngle = angle * i;
      const endAngle = startAngle + angle;
      pieSlices.push(
        <CamSlice
          key={i}
          index={i}
          radius={350}
          startAngle={startAngle}
          endAngle={endAngle}
          num={num}
          setVideoInfo={setVideoInfo}
        />
      );
    }
    return pieSlices;
  };

  useEffect(() => {
    const handleLoaded = () => {
      if (canvasRef.current) {
        setTimeout(() => {
          console.log("ready");
          setLoaded(true);
        }, 3000);
      }
    };

    if (canvasRef.current) {
      console.log(canvasRef.current.getContext("2d"));
      canvasCtx.current = canvasRef.current.getContext("2d");
      handleLoaded();
    }
  }, [canvasRef.current]);

  useEffect(() => {
    if (canvasRef.current && canvasCtx.current) {
      console.log("CamTest test test ");
      loadCupImages();
      const interval = setInterval(()=>{
        drawHands(canvasRef.current, canvasCtx.current, handData);
      }, 1000 / 60);
      return () => {
        clearInterval(interval);
      };
    }
  }, []);


  /* 건배 신호를 받기 위한 세션 열기 */
  useEffect(() => {
    const session = props.user.getStreamManager().session;

    const onCheersOn = (event:any) => {
      // if(!cheersMode)
        setCheersMode(true);
      console.log("건배모드 켜기");
    }

    const onCheersOff = (event:any) => {
      // if(cheersMode)
        setCheersMode(false);
      console.log("건배모드 끄기");
      console.log("cheersMode:",cheersMode);
    }

    session.on("signal:cheersOn", onCheersOn);
    session.on("signal:cheersOff", onCheersOff);

    return () => {
      session.off("signal:cheersOn", onCheersOn);
      session.off("signal:cheersOff", onCheersOff);
    }
  }, []);

  useEffect(() =>{
    console.log("건배모드 상태!!!",cheersMode);
  }, [cheersMode])

  const drawHands = (can_ref: any, can_ctx: any, handData: any) => {
    // console.log('drawhands');
    can_ctx.save();
    can_ctx.clearRect(0, 0, can_ref.width, can_ref.height);
    const videoInfos = videoInfosRef.current;
    for (let id in handData){
      if (handData[id] && videoInfos[id]){
        const videoInfo = videoInfos[id];
        
        const hand5 = handData[id][5];
        const hand17 = handData[id][17];
        const handVector = {x: hand5.x-hand17.x, y: hand5.y-hand17.y, z: hand5.z-hand17.z};
        drawCup(can_ref, can_ctx, handData[id], videoInfo);

        // handData[id].forEach((landmark:{x:number, y:number, z:number})=>{
        //   const cal = calculateLocation(landmark.x, landmark.y, videoInfo);
        //   can_ctx.beginPath();
        //   can_ctx.fillStyle = "red";
        //   can_ctx.arc(cal.x, cal.y, 5, 0, 2 * Math.PI);
        //   can_ctx.fill();
        //   can_ctx.closePath();
        // })
      }
    }
    can_ctx.restore();
  }

  // const loadCupImages = async (can_ref: HTMLCanvasElement, can_ctx: CanvasRenderingContext2D, hand:any) => {
  const loadCupImages = async () => {
    try {
      for (let type in images) {
        const img = new Image();
        img.src = images[type];
        // 이미지 로딩을 Promise로 감싸 비동기로 처리
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });
        imgElements[type] = img;
      }
      // 모든 이미지 로딩이 완료되면 애니메이션 시작
    } catch (error) {
      console.error("Error loading cup images:", error);
    }
  };


  const drawCup = (can_ref: HTMLCanvasElement, can_ctx: CanvasRenderingContext2D, hand:any, videoInfo:any): void => {
    const w = can_ref.width;
    const h = can_ref.height;
    const hand5 = hand[5];
    const hand17 = hand[17];
    const handVector = {x: hand5.x-hand17.x, y: hand5.y-hand17.y, z: hand5.z-hand17.z};
    const handVectorDistance = (handVector.x**2 + handVector.y**2+handVector.z**2)**0.5;
    const angle = Math.acos(Math.abs(handVector.y)/handVectorDistance);
    const cupSize = Math.abs(handVector.y)*3*videoInfo.scale;
    // console.log(handVector.y,cupSize);
    const img = imgElements["beer"];
      // (player.state < 1)
      //   ? imgElements["player_normal"]
      //   : imgElements["player_sick"];
    // console.log(hand5);
    const cal = calculateLocation(hand5.x, hand5.y, videoInfo);
    // console.log(cal);
    if(angle < 0.7)
    {  can_ctx.drawImage(
        img,
        (cal.x - w * cupSize/2),
        (cal.y - h * cupSize/2),
        cupSize * w,
        cupSize * h
      );
    }
  }


  const calculateLocation = (
    x: number,
    y: number,
    videoInfo: {
      width: number;
      height: number;
      left: number;
      top: number;
      scale: number;
    }
  ) => {
    const scale = videoInfo.scale ? videoInfo.scale : 1;
    const transformedWidth = videoInfo.width * scale;
    const transformedHeight = videoInfo.height * scale;
    const transformedTop =
      videoInfo.top + (videoInfo.height - transformedHeight) / 2;
    const transformedLeft =
      videoInfo.left + (videoInfo.width - transformedWidth) / 2;
    return {
      x: transformedLeft + transformedWidth * (1 - x),
      y: transformedTop + transformedHeight * y,
    };
  };

  const setVideoInfo = (
    conId: number,
    width: number,
    height: number,
    left: number,
    top: number,
    scale: number
  ) => {
    const videoInfos = videoInfosRef.current;
    videoInfos[conId] = {
      width: width,
      height: height,
      left: left,
      top: top,
      scale: scale,
    };
    console.log(videoInfos);
  };
  const [dark, setDark] = useState(false);
  const sendRouletteSignal = () => {
    const targetAngle = rouletteAngle();
    if (props.user.getStreamManager().session) {
      props.user
        .getStreamManager()
        .session.signal({ data: targetAngle, to: [], type: "rouletteSignal" })
        .then(() => {
          effectSound(rouletteSound, false);
          console.log("Roulette Signal: ", targetAngle);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  /* 룰렛 각도 결정 함수*/
  const rouletteAngle = () => {
    const randSlice: number = Math.floor(Math.random() * num);
    const rotations: number = Math.floor(Math.random() * 10) + 8;
    const targetAngleOffset: number = -180 + Math.random() * 360; // 변경된 무작위 각도 오프셋
    const targetAngle: number = -(
      360 * rotations +
      randSlice * (360 / num) +
      targetAngleOffset
    ); // 오프셋 추가
    return targetAngle;
  };

  /* 룰렛 함수*/
  const roulette = (targetAngle: number) => {
    setDark(true);
    const memberCount = props.user.getSubscriber().length + 1;
    const spinDuration = 5;
    const targetAnglePeople = Math.abs(targetAngle % 360);
    console.log("걸린사람 : " + targetAnglePeople);
    if (svgRef.current) {
      svgRef.current.style.transform = `rotate(${targetAngle}deg)`;
      svgRef.current.style.transformOrigin = "center";
      svgRef.current.style.transition = `transform ${spinDuration}s cubic-bezier(0.4, 0, 0.2, 1)`;
    }
    console.log(memberCount);

    let a = 0;
    console.log(memberCount, 360 / memberCount);
    while (targetAnglePeople >= a) {
      a += 360 / memberCount;
      setCounts((prevCounts: number) => prevCounts + 1);
      console.log(a, counts);
    }
    setFlag(0);
    setTimeout(() => {
      setFlag(1);
      console.log(flag);
      setTimeout(() => {
        reset();
      }, 10);
      setTimeout(() => {
        setFlag(0);
        setCounts(0);
        console.log(flag, counts);
        setDark(false);
      }, 5000);
    }, 5000);
    const reset = () => {
      if (svgRef.current) {
        svgRef.current.style.transform = "rotate(0deg)";
        svgRef.current.style.transformOrigin = "center";
        svgRef.current.style.transition =
          "transform 1s cubic-bezier(0.4, 0, 0.2, 1)";
      }
    };
  };

  // useEffect(() => {
  //   setAngle(360 / num);
  // }, [num]);

  function cheersImg() {
    const cheersImgGroup = [];
    for (let i = 0; i < 4; i++) {
      const img_class = `${styles.cheersImgVer} ${styles[`bottom${i}`]}`;
      const img_src = "asset/cheers/cheers0" + i + ".png";
      cheersImgGroup.push(<img className={img_class} src={img_src} key={i} />);
    }
    for (let i = 10; i < 15; i++) {
      const img_class = `${styles.cheersImgVer} ${styles[`top${i}`]}`;
      const img_src = "asset/cheers/cheers" + i + ".png";
      cheersImgGroup.push(<img className={img_class} src={img_src} key={i} />);
    }
    for (let i = 20; i < 24; i++) {
      const img_class = `${styles.cheersImgHor} ${styles[`left${i}`]}`;
      const img_src = "asset/cheers/cheers" + i + ".png";
      cheersImgGroup.push(<img className={img_class} src={img_src} key={i} />);
    }
    for (let i = 30; i < 32; i++) {
      const img_class = `${styles.cheersImgHor} ${styles[`right${i}`]}`;
      const img_src = "asset/cheers/cheers" + i + ".png";
      cheersImgGroup.push(<img className={img_class} src={img_src} key={i} />);
    }
    return cheersImgGroup;
  }

  /* ========================================================= */

  // drinkEffect : 0 => 건배 모드 X 평소 상태,
  // drinkEffect : 0 => 건배 모드
  const [drinkEffect, setDrinkEffect] = useState(0);
  // 건배를 누른 인원의 수
  let count = 0;

  // 모든 유저가 건배 버튼을 눌렀을 때 실행되는 함수
  // 이펙트 호출을 위한 setDrinkEffect(1)
  // count 초기화
  function readyToDrink() {
    setDrinkEffect(1);
    count = 0;
    setTimeout(() => {
      setDrinkEffect(0);
    }, 2000);
  }

  //
  useEffect(() => {
    props.user
      .getStreamManager()
      .stream.session.on("signal:cheersData", (event: any) => {
        const data = JSON.parse(event.data);
        // handData.current = data.hand;
        // console.log(handData.current);
        handData[event.from.connectionId] = data.hand;
        console.log(handData);
      });

    props.user
      .getStreamManager()
      .session.on("signal:cheersSignal", (event: any) => {
        count += 1;
        if (count === props.user.getSubscriber().length + 1) {
          readyToDrink();
        }
      });

    props.user
      .getStreamManager()
      .session.on("signal:rouletteSignal", (event: any) => {
        console.log("받은 각도:", event.data);
        roulette(event.data);
      });
  }, []);

  const sendCheersReadySignal = () => {
    if (props.user.getStreamManager().session) {
      props.user
        .getStreamManager()
        .session.signal({ data: "cheersReady", to: [], type: "cheersSignal" })
        .then(() => {
          console.log("one more user is ready to drink");
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  /* ========================================================= */

  return (
    <div>
      <div className={styles.circleLight}> </div>
      {dark && (
        <>
          {/* <img className={styles.lights} src="/Lights_010.png"/> */}
          <div className={styles.darkScreen} />
          <div className={styles.circleRouletteLight}></div>
        </>
      )}
      <div className={styles.triangleDown} />
      <div>
        <button type="submit" onClick={sendRouletteSignal}>
          돌려
        </button>
      </div>
      <div>
        <button type="submit" onClick={sendCheersReadySignal}>
          건배준비
        </button>
      </div>
      <div className={styles.scale}>
        <svg ref={svgRef} className={styles.position} width={700} height={700}>
          {renderCamSlices(setVideoInfo)}
        </svg>
        <canvas
          className={`${styles.position} ${!cheersMode ? styles.hidden : ''}`}
          ref={canvasRef}
          width={700}
          height={700}
        />
      </div>
      {drinkEffect === 1 ? cheersImg() : null}
    </div>
  );
};

export default CamTest;
