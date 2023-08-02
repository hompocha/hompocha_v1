import { useState, useRef, useEffect } from "react";
import UserVideoComponent from "./UserVideoComponent";
import styles from "./CamTest.module.scss";
import { event } from "jquery";
import BGM from "../sounds/roomBGM.wav";
import useSound from "../useSound";
import rouletteSound from "../sounds/rouletteEffect.wav";
import { effectSound } from "../effectSound";

const CamTest = (props: any) => {
  /* 배경음악 */
  useSound(BGM, 1);
  interface Props {
    index: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    num: number;
  }
  const num = props.user.getSubscriber().length + 1;
  const svgRef = useRef<SVGSVGElement>(null);
  const [flag, setFlag] = useState(0);
  const [counts, setCounts] = useState(0);
  // const memberCount = useRef(num);

  /* 부채꼴 모양으로 자른 캠 */
  const CamSlice: React.FC<Props> = ({
    index,
    radius,
    startAngle,
    endAngle,
    num,
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
            />
          )}
          {flag === 1 && (
            <UserVideoComponent
              streamManager={members[counts - 1]}
              index={1}
              num={num}
              mode="roulette"
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
  const renderCamSlices = () => {
    const angle = 360 / num - 0.01;
    const pieSlices = [];

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
        />
      );
    }
    return pieSlices;
  };

  const sendRouletteSignal = () => {
    const targetAngle = rouletteAngle();
    if (props.user.getStreamManager().session) {
      props.user
        .getStreamManager()
        .session.signal({ data: targetAngle, to: [], type: "rouletteSignal" })
        .then(() => {
          effectSound(rouletteSound);
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
          {renderCamSlices()}
        </svg>
      </div>
      {drinkEffect === 1 ? cheersImg() : null}
    </div>
  );
};

export default CamTest;
