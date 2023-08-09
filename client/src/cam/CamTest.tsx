import { useState, useRef, useEffect, useCallback } from "react";
import UserVideoComponent from "./UserVideoComponent";
import styles from "./CamTest.module.scss";
import { event } from "jquery";
import BGM from "../sounds/roomBGM.wav";
import useSound from "../useSound";
import rouletteSound from "../sounds/rouletteEffect.wav";
import cheers_sample from "../sounds/cheers_sample.wav";
import { effectSound } from "../effectSound";
import { Results, Hands, HAND_CONNECTIONS, VERSION } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { RenderTime } from "./RoundTimer";
import html2canvas from "html2canvas";
import axios from "axios";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const images: { [name: string]: string } = {
  beer: "../../Drink/beerForCheers.png",
};

const CamTest = (props: any) => {
  /* 배경음악 */
  useSound(BGM, 0.5);
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
  const [wheelStart, setWheelStart] = useState(false);
  const key = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const videoInfosRef = useRef<{ [id: string]: any }>({});
  const imgLoaded = useRef<Boolean>(false);

  const myself = props.user.connectionId;
  const newHandData: { [id: string]: any } = {};
  const cheersCup: { [id: string]: any } = {};
  const imgElements: { [key: string]: HTMLImageElement } = {};
  const cheersRef = useRef<Boolean>(false);

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
          {/*flag 0이면 일반대화모드 */}
          {flag === 0 && (
            <UserVideoComponent
              streamManager={members[index]}
              index={index}
              num={num}
              mode={mode}
              cheers={cheersMode}
              myself={myself}
              setVideoInfo={setVideoInfo}
            />
          )}
          {/*flag 1이면 룰렛 결과가 나오는거*/}
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
      const interval = setInterval(() => {
        updateCups(canvasRef.current, newHandData);
        drawHands(canvasRef.current, canvasCtx.current, newHandData);
      }, 1000 / 60);
      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  /* 건배 신호를 받기 위한 세션 열기 */
  useEffect(() => {
    const session = props.user.getStreamManager().session;

    const onCheersOn = (event: any) => {
      // if(!cheersMode)
      setCheersMode(true);
      console.log("건배모드 켜기");
      setTimeout(() => {
        setCheersMode(false);
        key.current += 1;
      }, 15 * 1000);
    };

    const onCheersOff = (event: any) => {
      // if(cheersMode)
      setCheersMode(false);
      console.log("건배모드 끄기");
      console.log("cheersMode:", cheersMode);
    };

    session.on("signal:cheersOn", onCheersOn);
    session.on("signal:cheersOff", onCheersOff);

    return () => {
      session.off("signal:cheersOn", onCheersOn);
      session.off("signal:cheersOff", onCheersOff);
    };
  }, []);

  useEffect(() => {
    console.log("건배모드 상태!!!", cheersMode);
  }, [cheersMode]);

  const updateCups = (can_ref: any, newHandData: any) => {
    const keys = Object.keys(newHandData);
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const cupA = newHandData[keys[i]];
        const cupB = newHandData[keys[j]];
        // const distance = ((cupA.transformedHand.x - cupB.transformedHand.x)**2
        //                   + (cupA.transformedHand.y - cupB.transformedHand.y)**2) **0.5;
        const distanceX = Math.abs(
          cupA.transformedHand.x - cupB.transformedHand.x
        );
        const distanceY = Math.abs(
          cupA.transformedHand.y - cupB.transformedHand.y
        );
        if (
          distanceX <
            (((cupA.cupSize + cupB.cupSize) * 0.58) / 2) *
              0.7 *
              can_ref.width &&
          distanceY < ((cupA.cupSize + cupB.cupSize) / 2) * 0.7 * can_ref.height
        ) {
          // console.log('collision: ', keys[i], keys[j]);
          // if (cupA.collision===false && cupB.collision===false){
          //   effectSound(cheers_sample, false);
          // }
          cupA.collision = true;
          cupB.collision = true;
        } else {
          cupA.collision = false;
          cupB.collision = false;
        }
      }
    }
    let cheers = false;
    for (let id in newHandData) {
      if (newHandData[id].collision === false) {
        newHandData[id].cup = newHandData[id].transformedHand;
      } else {
        cheers = true;
      }
    }
    if (cheers) {
      if (!cheersRef.current) {
        effectSound(cheers_sample, false);
        cheersRef.current = true;
      }
    } else {
      cheersRef.current = false;
    }
  };

  const drawHands = async (can_ref: any, can_ctx: any, newHandData: any) => {
    // console.log('drawhands');
    can_ctx.save();
    can_ctx.clearRect(0, 0, can_ref.width, can_ref.height);
    // const videoInfos = videoInfosRef.current;
    // console.log("imgLoaded: ",imgLoaded);
    if (!imgLoaded.current) {
      await loadCupImages();
      imgLoaded.current = true;
    }
    for (let id in newHandData) {
      if (newHandData[id]) {
        const mine = id === myself ? true : false;
        drawCup(can_ref, can_ctx, newHandData[id]);
      }
    }
    can_ctx.restore();
  };

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

  const drawCup = (
    can_ref: HTMLCanvasElement,
    can_ctx: CanvasRenderingContext2D,
    hand: any
  ): void => {
    const w = can_ref.width;
    const h = can_ref.height;
    const img = imgElements["beer"];
    if (hand.angle < 0.7) {
      can_ctx.drawImage(
        img,
        hand.cup.x - (w * hand.cupSize * 0.58) / 2,
        hand.cup.y - (h * hand.cupSize) / 2,
        hand.cupSize * 0.58 * w,
        hand.cupSize * h
      );
    }
  };

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

  /* ========================================================= */

  // // drinkEffect : 0 => 건배 모드 X 평소 상태,
  // // drinkEffect : 0 => 건배 모드
  // const [drinkEffect, setDrinkEffect] = useState(0);
  // // 건배를 누른 인원의 수
  // let count = 0;

  // // 모든 유저가 건배 버튼을 눌렀을 때 실행되는 함수
  // // 이펙트 호출을 위한 setDrinkEffect(1)
  // // count 초기화
  // function readyToDrink() {
  //   setDrinkEffect(1);
  //   count = 0;
  //   setTimeout(() => {
  //     setDrinkEffect(0);
  //   }, 2000);
  // }

  //
  useEffect(() => {
    props.user
      .getStreamManager()
      .stream.session.on("signal:cheersData", (event: any) => {
        const data = JSON.parse(event.data);
        const id = event.from.connectionId;
        if (data.hand !== null && data.hand !== undefined) {
          if (videoInfosRef.current[id]) {
            const hand = data.hand;
            const videoInfo = videoInfosRef.current[id];
            // const mine = (id === myself)? true:false;
            const transformedHand = calculateLocation(
              hand.hand5.x,
              hand.hand5.y,
              videoInfo
            );
            const handVector = {
              x: hand.hand5.x - hand.hand17.x,
              y: hand.hand5.y - hand.hand17.y,
              z: hand.hand5.z - hand.hand17.z,
            };
            const handVectorDistance =
              (handVector.x ** 2 + handVector.y ** 2 + handVector.z ** 2) **
              0.5;
            const angle = Math.acos(
              Math.abs(handVector.y) / handVectorDistance
            );
            let cupSize = Math.abs(handVector.y) * 3 * videoInfo.scale;
            cupSize = cupSize > 0.35 ? 0.35 : cupSize;

            if (newHandData[id] === undefined) {
              const d = {
                transformedHand: transformedHand,
                angle: angle,
                cupSize: cupSize,
                hand: hand,
                collision: false,
                cup: transformedHand,
              };
              newHandData[id] = d;
            } else {
              newHandData[id].transformedHand = transformedHand;
              newHandData[id].angle = angle;
              newHandData[id].cupSize = cupSize;
              newHandData[id].hand = hand;
              // newHandData[id].collision = false;
            }
          }
        }
      });

    // props.user
    //   .getStreamManager()
    //   .session.on("signal:cheersSignal", (event: any) => {
    //     count += 1;
    //     if (count === props.user.getSubscriber().length + 1) {
    //       readyToDrink();
    //     }
    //   });

    props.user
      .getStreamManager()
      .session.on("signal:rouletteSignal", (event: any) => {
        console.log("받은 각도:", event.data);
        roulette(event.data);
      });
  }, []);

  /* ========================================================= */

  /*===========================================================*/
  useEffect(() => {
    if (props.wheel === true) {
      sendRouletteSignal();
      props.hubForWheelFalse();
    }
  }, [props.wheel]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);

  const foreignObjectRef = useRef(null);

  const captureSvg = async () => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const tempElement = document.createElement("div");
    tempElement.style.width = `${container.offsetWidth}px`;
    tempElement.style.height = `${container.offsetHeight}px`;
    tempElement.style.position = "fixed";
    // tempElement.style.visibility = 'hidden';

    container.appendChild(tempElement);

    try {
      const clonedSvg = container.cloneNode(true);
      tempElement.appendChild(clonedSvg);

      const videoElements = container.querySelectorAll("video");
      const tempVideoElements = (clonedSvg as HTMLElement).querySelectorAll(
        "video"
      );

      videoElements.forEach((video, index) => {
        if (video.currentTime && video.readyState >= 2) {
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = video.offsetWidth || video.videoWidth;
          tempCanvas.height = video.offsetHeight || video.videoHeight;
          const tempCtx = tempCanvas.getContext("2d");
          if (!tempCtx) return;
          tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

          // 기존 비디오 태그에 대한 인라인 스타일 가져오기 및 적용
          const srcVideoStyles = window.getComputedStyle(video);
          const tempImg = document.createElement("img");
          Array.from(srcVideoStyles).forEach((styleName) => {
            const styleValue = srcVideoStyles.getPropertyValue(styleName);
            tempImg.style.setProperty(styleName, styleValue);
          });

          tempImg.src = tempCanvas.toDataURL("image/png");
          // tempImg.style.position = 'absolute';
          // tempImg.style.top = `${video.offsetTop}px`;
          // tempImg.style.left = `${video.offsetLeft}px`;
          tempElement.style.width = `${video.offsetWidth}px`;
          tempElement.style.height = `${video.offsetHeight}px`;

          tempVideoElements[index].replaceWith(tempImg);
        }
      });

      const capturedCanvas = await html2canvas(tempElement, {
        backgroundColor: null,
      });
      const dataUrl = capturedCanvas.toDataURL("image/png");
      setCapturedImageUrl(dataUrl);
      console.log("생성!");
    } catch (err) {
      console.error("Error capturing SVG:", err);
    } finally {
      container.style.visibility = "";
      tempElement.remove();
    }
  };

  const [isCaptureClicked, setIsCaptureClicked] = useState(false);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    if (captured) {
      handleSaveButtonClick();
      setIsCaptureClicked(true);

      const timer = setTimeout(() => {
        setIsCaptureClicked(false);
        setCaptured(false); // 추가
        setCapturedImageUrl(null); // 추가
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [captured]);

  const [showShutterEffect, setShowShutterEffect] = useState(false); // 상태 변수 추가
  const [showCountdownText, setShowCountdownText] = useState(false); // 상태 변수 추가
  const [countdownText, setCountdownText] = useState("3");
  // 현재 handleButtonClick 함수 안에서 captureSvg 함수 호출 부분을 변경하세요:
  const handleButtonClick = async () => {
    let counter = 3;
    // 카운트다운 텍스트 출력
    const timer = setInterval(() => {
      setShowCountdownText(true);
      if (counter === 0) {
        clearInterval(timer);
        setShowShutterEffect(true);

        // 셔터 효과 이후 이미지 캡처 진행
        setTimeout(async () => {
          await captureSvg();
          setShowShutterEffect(false);
          setTimeout(() => {
            setCaptured(true);
            setShowCountdownText(false);
          }, 3000);
        }, 500);
      } else {
        setCountdownText(counter.toString());
      }

      counter--;
    }, 1000);
  };

  const handleSaveButtonClick = () => {
    if (capturedImageUrl) {
      const link = document.createElement("a");
      link.href = capturedImageUrl;
      link.download = "captured_image.png";
      link.click();
    }
    return () => setCapturedImageUrl(capturedImageUrl);
  };

  return (
    <div>
      <div className={styles.cameraIcon}>
        <button
          onClick={handleButtonClick}
          style={{
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          {" "}
          <img
            src="/camera1.png"
            style={{ width: "70px", height: "70px" }}
          ></img>{" "}
        </button>
      </div>
      {showCountdownText && (
        <div className={styles.countdownText}>{countdownText}</div>
      )}

      {capturedImageUrl && (
        <div className={styles.capture}>
          <img src={capturedImageUrl} alt="Captured" />
        </div>
      )}
      {showShutterEffect && <div className={styles.shutterEffect}></div>}
      <div className={styles.circleLight}> </div>
      {dark && (
        <>
          {/* <img className={styles.lights} src="/Lights_010.png"/> */}
          <div className={styles.darkScreen} />
          <div className={styles.circleRouletteLight}></div>
          <div className={styles.triangleDown} />
        </>
      )}

      <div className={styles.scale}>
        <div ref={containerRef} className={styles.position}>
          <foreignObject ref={foreignObjectRef} width="100%" height="100%">
            <svg ref={svgRef} width={700} height={700}>
              {renderCamSlices(setVideoInfo)}
            </svg>
          </foreignObject>
        </div>
        <svg ref={svgRef} className={styles.position} width={700} height={700}>
          {renderCamSlices(setVideoInfo)}
        </svg>
        <canvas
          className={`${styles.position} ${!cheersMode ? styles.hidden : ""}`}
          ref={canvasRef}
          width={700}
          height={700}
        />
      </div>

      <div
        className={`${styles.drinkEffectTimer} ${
          !cheersMode ? styles.hidden : ""
        }`}
      >
        <CountdownCircleTimer
          key={key.current}
          isPlaying={cheersMode}
          duration={15}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[15, 6, 3, 0]}
        >
          {RenderTime}
        </CountdownCircleTimer>
      </div>
    </div>
  );
};

export default CamTest;
