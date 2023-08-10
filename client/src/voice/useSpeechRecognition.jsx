import React, { useState, useEffect, useContext, useRef } from "react";
import useSpeechRecognition from "./useSpeechRecognitions";
import styles from "./useSpeechRecognition.module.css";
import "regenerator-runtime/runtime";
import somaekSuccess from "../sounds/somaekSuccess.wav";
import { effectSound } from "../effectSound";
import UserInput from "./UserInput";
import "animate.css";
import FunctionContext from "../FunctionContext";

const keyword = ["고양이", "벚꽃", "강아지", "그만해", "뭐 먹을까"];
const speech_sentence = [
  "간장 공장 공장장은 강 공장장이다",
  "내가 그린 기린 그림은 긴 기린 그림이다",
  "철수 책상 철 책상",
  "상업 산업 사업을 상상한다",
  "뒷집 콩죽은 햇콩 단콩 콩죽이다",
  "안 촉촉한 초코칩 나라에 살던 안 촉촉한 초코칩",
  "네가 그린 기린 그림은 못생긴 기린 그림이다",
  "시골 찹쌀 햇찹쌀",
  "도시 찹쌀 촌 찹쌀",
  "확률분포표",
  "빼빼 마른 빼빼로",
  "난방 방법 변경",
  "상담 담당 선생님",
  "새우 로얄 뉴 로얄",
  "특허 허가과 허가 과장 허 과장",
  "신분당선 환승역은 신논현역 사이",
  "청단풍잎 홍단풍잎 흑단풍잎 백단풍잎",
  "청 단풍잎 홍 단풍잎 흑 단풍잎 백 단풍잎",
  "창경원 창살은 쌍 창살",
  "분당 운중동 한국학중앙연구원",
  "명계남 명장면 명대사는 명품 연기이다",
  "7월 7일은 평창 친구 진정 칠순잔치 날",
  "삼성 설립 사장의 회사 자산 상속자",
  "고려고 교복은 고급 교복",
  "콩깍지는깐 콩깍지인가 안깐 콩깍지인가",
  "상표 붙인 큰 깡통은깐 깡통",
];
const gameStartKeywords = [
  "사장님 발음 게임이요",
  "사장님 소맥 게임이요",
  "사장님 피하기 게임이요",
  "소맥 게임이요",
  "발음 게임이요",
  "다른 게임 이요",
  "피하기 게임 이요",
];
const wheelKeyword = ["돌려주세요", "돌려 주세요"];

const themeChangeKeywords = ["테마 바꿔 주세요"];
const UseSpeechRecognition = (props) => {
  // console.log(props);
  const [value, setValue] = useState("");
  const [listenBlocked, setListenBlocked] = useState(false);
  const [extractedValue, setExtractedValue] = useState("");
  const [stopSign, setStopSign] = useState(true);
  const [keywordFromOthers, setKeywordFromOthers] = useState("");
  const [isListening, setIsListening] = useState(true);
  const [firstListening, setFirstListening] = useState(true);



  const lang = "ko-Kr";
  useEffect(() => {
    /* 건배 명령어 */

    /* 대화모드일때만 발동*/
    if (props.mode === undefined) {
      for (const keyword of wheelKeyword) {
        if (value.includes(keyword)) {
          stop();
          setStopSign(false);
          sendKeywordSignal("돌려주세요");
          props.hubTospeechFromCamtest();
        }
      }
      if (value.includes("우리 한잔할까")) {
        stop();
        setStopSign(false);
        sendKeywordSignal("우리 한잔할까");
        props.sendCheersOnSignal();
      }
      if (value.includes("담배")) {
        stop();
        setStopSign(false);
        props.sendCheersOffSignal();
      }
      if (value.includes("사진 찍어 주세요")) {
        stop();
        setStopSign(false);
        sendKeywordSignal("사진 찍어 주세요");
        props.sendCaptureSignal();
      }

      /* 키워드 명령어 */
      for (const word of keyword) {
        if (value.includes(word)) {
          if (word === extractedValue) {
            sendKeywordSignal("");
            sendKeywordSignal(word);
          }
          sendKeywordSignal(word);
          stop();
          setStopSign(false);
          props.sendEffectSignal(word);
        }
      }

      /* 게임시작 명령어 */
      for (const gameStartKeyword of gameStartKeywords) {
        if (value.includes(gameStartKeyword)) {
          if(gameStartKeyword ==="다른 게임 이요")
              sendKeywordSignal("발음 게임이요");
          else {
            sendKeywordSignal(gameStartKeyword);
          }
          switch (gameStartKeyword) {
            case "발음 게임이요":
              stop();
              props.sendGameTypeSignal("speechGame");
              break;
            case "다른 게임 이요":
              stop();
              props.sendGameTypeSignal("speechGame");
              break;
            case "소맥 게임이요":
              stop();
              props.sendGameTypeSignal("somaek");
              break;
            case "피하기 게임 이요":
              stop();
              props.sendGameTypeSignal("avoidGame");
              break;
            default:
              break;
          }
        }
      }
    }
    /*여기까지...---*/

    if (value.includes("채팅창 보여 줘")) {
      stop();
      setStopSign(false);
      sendKeywordSignal("채팅창 보여줘");
      toggleChat();
    }
    if (value.includes("채팅 창 닫아 줘")) {
      stop();
      setStopSign(false);
      sendKeywordSignal("채팅창 닫아줘");
      toggleChat();
    }

    /* 발음게임 명령어 */
    if (props.mode === "speechGame") {
      for (const sentence of speech_sentence) {
        if (value.includes(sentence)) {
          sendKeywordSignal(sentence);
          props.sendSpeech(
            props.user.streamManager.stream.connection.connectionId
          );
        }
      }
    }

    /* 테마 변경을 위한 음성 인식 */
    for (const themeChangeKeyword of themeChangeKeywords) {
      if (value.includes(themeChangeKeyword)) {
        sendKeywordSignal(themeChangeKeyword);
        stop();
        setStopSign(false);
        props.sendThemeSignal();
      }
    }
    console.log("Value:", value); // 추가된 부분
  }, [value]);

  useEffect(() => {
    let isMounted = true;
    if (!stopSign) {
      const timeout = setTimeout(() => {
        if (isMounted) {
          setStopSign(true);
          listen({ lang });
        }
      }, 1500);
      return () => {
        isMounted = false;
        clearTimeout(timeout);
      };
    }
  }, [stopSign]);

  useEffect(()=>{
    if (props.mode === "speechGame") {
      if (!props.checkvoice && isListening) {
        stop();
        setIsListening(false);
      } else if (props.checkvoice && !isListening) {
        listen({lang});
        setIsListening(true);
      }
    }
  },[props.checkvoice])


  /* */
  useEffect(() => {
    if (extractedValue !== "") {
      const timeout = setTimeout(() => {
        sendKeywordSignal("");
        // setExtractedValue("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [extractedValue]);

  const onEnd = () => {
    // You could do something here after listening has finished
  };

  const onResult = (result) => {
    setValue(result);
  };

  const onError = (event) => {
    if (event.error === "not-allowed") {
      setListenBlocked(true);
    }
  };

  const handleUserInput = (input) => {
    setValue(input);
  };

  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult,
    onEnd,
    onError,
  });

  /* 듣기가 멈춰있으면 */
  const toggle = listening
    ? stop
    : () => {
        console.log(props.speechBlocked);
        console.log("asdf");
        setListenBlocked(false);
        listen({ lang });
      };
  /* Room 입장 후 음성인식이 바로 실행되고, 30초에 한번씩 음성인식 기능 on/off 반복 구현 */
  /* 현재 방으로 이동 시 오류 발생, 개선필요 */
  useEffect(() => {
    if (props.speechBlocked === true) {
      stop();
    } else {
      setTimeout(() => {
        setListenBlocked(false);
        listen({ lang });
      }, 1000);

      let voiceRecog = setInterval(() => {
        setTimeout(stop, 29 * 1000);

        setListenBlocked(false);
        listen({ lang });

        console.log(listenBlocked);
      }, 30 * 1000);
      return () => {
        clearInterval(voiceRecog);
        stop();
        console.log("음성인식 종료");
      };
    }
  }, [props.speechBlocked]);

  const [animationClass, setAnimationClass] = useState("");

  /* 누군가가 키워드 언급했을 때 신호 받아서 출력 */
  /* 나일 경우 ExtractedValue, 남일경우 ValueFromOthers*/
  useEffect(() => {
    props.user
      .getStreamManager()
      .stream.session.on("signal:keyword", (event) => {
        const keywordSignalData = JSON.parse(event.data);

        if (keywordSignalData.nickname === props.user.getNickname()) {
          setExtractedValue(keywordSignalData.keyword);
          setKeywordFromOthers("");
        } else {
          if (keywordSignalData.keyword !== "") {
            const tempKeyword =
              keywordSignalData.nickname + " : " + keywordSignalData.keyword;
            setKeywordFromOthers(tempKeyword);
            setExtractedValue("");
          }
        }
      });
  }, [props.user]);

  useEffect(() => {
    if (extractedValue !== "") {
      setAnimationClass("animate__animated animate__fadeIn");

      const timeout = setTimeout(() => {
        setAnimationClass("animate__animated animate__fadeOut");
      }, (0.5 + 1.5) * 1000); // backInLeft가 1.5초 동안 진행되고, 2초 동안 정지

      return () => clearTimeout(timeout);
    }
  }, [extractedValue]);

  useEffect(() => {
    if (keywordFromOthers !== "") {
      setAnimationClass("animate__animated animate__fadeIn");

      const timeout = setTimeout(() => {
        setAnimationClass("animate__animated animate__fadeOut");
      }, (0.5 + 1.5) * 1000); // backInLeft가 1.5초 동안 진행되고, 2초 동안 정지

      return () => clearTimeout(timeout);
    }
  }, [keywordFromOthers]);

  /*Context 성균*/
  const context = useContext(FunctionContext);
  const toggleChat = () => {
    context.setChatToggleSwitch((prevState) => !prevState);
  };

  /* 키워드를 인식하면 신호를 보냄 */
  const sendKeywordSignal = (string) => {
    if (props.user.getStreamManager().session) {
      props.user
        .getStreamManager()
        .session.signal({
          data: JSON.stringify({
            keyword: string,
            nickname: props.user.getNickname(),
          }),
          to: [],
          type: "keyword",
        })
        .then(() => {
          console.log("다른 유저들에게도 키워드가 출력되도록 전송합니다.");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      {props.mode === "speechGame" && (
        <div className={styles.speechWord}>
          {value}

        </div> )}

       {/* <UserInput onSubmit={handleUserInput} /> */}
      {props.mode === undefined && (
        <div className={styles.keywordEffect}>
          <div className={`${animationClass} ${styles.extractedValue}`}>
            {extractedValue}
          </div>
          <div className={`${animationClass} ${styles.keywordFromOthers}`}>
            {keywordFromOthers}
          </div>
        </div>
      )}
    </div>
  );
};

export default UseSpeechRecognition;
