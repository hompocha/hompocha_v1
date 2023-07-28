import React, { useState, useEffect, Component, useRef } from "react";
import useSpeechRecognition from "./useSpeechRecognitions";
import styles from "./voice.module.css";
import axios from "axios";
import "regenerator-runtime/runtime";

const keyword = ["고양이", "구름", "벚꽃", "강아지"];
const speech_sentence =["시작","간장 공장 공장장은 강 공장장이다","내가 그린 기린 그림은 긴 기린 그림이다","철수 책상 철 책상","상업 산업 사업을 상상한다"]

const UseSpeechRecognition = (props) => {
  // const [lang, setLang] = useState('ko-KR');
  const [value, setValue] = useState("");
  const [listenBlocked, setListenBlocked] = useState(false);
  const [extractedValue, setExtractedValue] = useState("");

  const lang = "ko-Kr";
  useEffect(() => {
    for (const sentence of speech_sentence) {
      if (value.includes(sentence)) {
        setExtractedValue(sentence);
        props.sendSpeech(props.user.streamManager.stream.connection.connectionId);
      }
    }
    for (const word of keyword) {
      if (value.includes(word)) {
        setExtractedValue(word);
        props.sendEffectSignal(word);
      }
    }
    console.log("Value:", value); // 추가된 부분
  }, [value]);

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

  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult,
    onEnd,
    onError,
  });

  const toggle = listening
    ? stop
    : () => {
        setListenBlocked(false);
        listen({ lang });
      };

  return (
    <div>
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
    </div>
  );
};

export default UseSpeechRecognition;
