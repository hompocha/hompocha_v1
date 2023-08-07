import React, { useState, useEffect, Component, useRef } from "react";
import useSpeechRecognition from "./useSpeechRecognitions";
import styles from "./voice.module.css";
import axios from "axios";
import "regenerator-runtime/runtime";
import somaekSuccess from "../sounds/somaekSuccess.wav";
import somaekFail from "../sounds/somaekFail.wav";
import { effectSound } from "../effectSound";
import styless from "./shootingStar.module.scss";
import { set } from "mongoose";
import UserInput from "./UserInput";

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
];
const gameStartKeywords = [
  "사장님 발음 게임이요",
  "사장님 소맥 게임이요",
  "사장님 피하기 게임이요",
  "발음 게임",
  "소맥 게임",
  "피하기 게임",
  "소맥 게임이요",
  "발음 게임이요",
  "피하기 게임 이요",
];
const wheelKeyword = ["돌려주세요"];

const themeChangeKeywords = ["테마 바꿔 주세요"];
const UseSpeechRecognition = (props) => {
  console.log(props);
  const [shootingStar, setShootingStar] = useState(true);
  const [value, setValue] = useState("");
  const [listenBlocked, setListenBlocked] = useState(false);
  const [extractedValue, setExtractedValue] = useState("");
  const [stopSign, setStopSign] = useState(true);
  const lang = "ko-Kr";
  useEffect(() => {
    /* 건배 명령어 */


    if (value.includes("담배")) {
      stop();
      setStopSign(false);
      props.sendCheersOffSignal();
    }
    if(props.mode === undefined) {
      for (const keyword of wheelKeyword) {
        if (value.includes(keyword)) {
          stop();
          setStopSign(false);
          props.hubTospeechFromCamtest();
        }
      }
      if (value.includes("우리 한잔할까")) {
        stop();
        setStopSign(false);
        props.sendCheersOnSignal();
      }
    }
    if (value.includes("채팅창 보여 줘")) {
      stop();
      setStopSign(false);
      props.chatChangeOn();
    }
    if (value.includes("채팅 창 닫아 줘")) {
      stop();
      setStopSign(false);
      props.chatChangeOff();
    }



    /* 발음게임 명령어 */
    for (const sentence of speech_sentence) {
      if (value.includes(sentence)) {
        effectSound(somaekSuccess);
        setExtractedValue(sentence);
        props.sendSpeech(
          props.user.streamManager.stream.connection.connectionId
        );
      }
    }

    /* 키워드 명령어 */
    for (const word of keyword) {
      if (value.includes(word)) {
        setExtractedValue(word);
        stop();
        setStopSign(false);
        props.sendEffectSignal(word);
      }
    }

    /* 게임시작 명령어 */
    for (const gameStartKeyword of gameStartKeywords) {
      if (value.includes(gameStartKeyword)) {
        setExtractedValue(gameStartKeyword);
        switch (gameStartKeyword) {
          case "발음 게임이요":
          // case "발음 게임":
            stop();
            props.sendGameTypeSignal("speechGame");
            break;
          case "소맥 게임이요":
          // case "소맥 게임":
            stop();
            props.sendGameTypeSignal("somaek");
            break;
          case "피하기 게임 이요":
          // case "피하기 게임":
            stop();
            props.sendGameTypeSignal("avoidGame");
            break;
          default:
            break;
        }
      }
    }

    /* 테마 변경을 위한 음성 인식 */
    for (const themeChangeKeyword of themeChangeKeywords) {
      if (value.includes(themeChangeKeyword)) {
        setExtractedValue(themeChangeKeyword);
        let randomNum = Math.floor(Math.random() * 3);
        if (randomNum === props.theme) {
          randomNum = (randomNum + 1) % 3;
        }
        switch (randomNum) {
          // 포차 테마
          case 0:
            props.setTheme(0);
            setShootingStar(true);
            break;
          // 바 테마
          case 1:
            props.setTheme(1);
            setShootingStar(false);
            break;
          // 이자카야 테마
          case 2:
            props.setTheme(2);
            setShootingStar(false);
            break;
          default:
            break;
        }
      }
    }
    console.log("Value:", value); // 추가된 부분
  }, [value]);

  useEffect(() => {
    if (!stopSign) {
      const timeout = setTimeout(() => {
        setStopSign(true);
        listen({ lang });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [stopSign]);

  useEffect(() => {
    if (extractedValue !== "") {
      const timeout = setTimeout(() => {
        setExtractedValue(" ");
      }, 500);
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
    setValue(input); // Update the value when user submits the form
  };

  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult,
    onEnd,
    onError,
  });

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

  return (
    <div>
      {props.mode === "speechGame" && (

        <div className={styles.speechWord}> {value}
          <UserInput onSubmit={handleUserInput} />
        </div>
      )} 
      {props.mode !== "speechGame" && shootingStar === true && (
        <div className={styless.night}>
          {Array.from({ length: 24 }, (_, index) => (
            <>
              <div className={styless.shooting_star} key={index}></div>
            </>
          ))}
        </div>
      )}
      {props.mode !== "speechGame" && (
      <div className={styles.container}>
        <form id="speech-recognition-form">
          {!supported && (
            <p>
              Oh no, it looks like your browser doesn&#39;t support Speech
              Recognition.
            </p>
          )}
          {supported && (
            <>
              <label htmlFor="transcript">사용자 음성</label>
              <textarea
                id="transcript"
                name="transcript"
                placeholder="음성 기다리는중..."
                value={value}
                rows={3}
                disabled
              />
              <button disabled={listenBlocked} type="button" onClick={toggle}>
                {listening ? "정지" : "듣기"}
              </button>
              {listenBlocked && (
                <p style={{ color: "red" }}>
                  The microphone is blocked for this site in your browser.
                </p>
              )}
              <label htmlFor="extractedValue">일치 키워드</label>
              <textarea
                id="extractedValue"
                name="extractedValue"
                placeholder="..."
                value={extractedValue}
                rows={2}
                disabled
              />
            </>
          )}
        </form>
      </div>
      )}
    </div>
  );
};

export default UseSpeechRecognition;
