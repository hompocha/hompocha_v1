import React, {useState, useEffect, Component, useRef} from 'react';
import  useSpeechRecognition  from './useSpeechRecognitions';
import styles from './voice.module.css';
import axios from 'axios';
import 'regenerator-runtime/runtime';
import Cat from '../keyword/cat';
import CloudCanvas from '../keyword/cloud';
import CherryBlossom from '../keyword/cherryBlossom'; 
import Rain from '../keyword/rain';
import CamFour from '../cam/CamFour.js';

import {CatCanvas} from "../keyword/cat";


const keyword = ["고양이", "구름", "벚꽃"];
const languageOptions = [{ label: '한국어 - ', value: 'ko-KR' }];

const Example = (props) => {

  // const [lang, setLang] = useState('ko-KR');
  const [value, setValue] = useState('');
  const [listenBlocked, setListenBlocked] = useState(false);
  const [extractedValue, setExtractedValue] = useState('');
  const [cats, setCats] = useState([]);
  const [showCat, setShowCat] = useState(false);
  const [showCloud, setShowCloud] = useState(false);
  const [showCherryBlossom, setShowCherryBlossom] = useState(false);



  const lang = 'ko-Kr';
  useEffect(() => {
    for (const word of keyword) {
      if (value.includes(word)) {
        setExtractedValue(word);
        
        // setValue("");
        // const timeout = setTimeout(() => {
        // }, 1000);
        // if (word === "고양이") {
        //   setValue("");
        //   setCats((prevCats) => [...prevCats, { x: 1100, y: 200 }]);
        // } else if (word === "구름") {
        //   setValue("");
        //   setShowCloud(true);
        // } else if (word === "벚꽃") {
        //   setValue("");
        //   setShowCherryBlossom(true);
        // }

        props.sendSignal(word);
    
        return () => clearTimeout(timeout);
      }
    }
    console.log("Value:", value); // 추가된 부분
  }, [value]); 


  useEffect(() =>  {
    if (extractedValue !== '') {
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
    if (event.error === 'not-allowed') {
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
    <>


    <div>
      <input
        onChange={(e) => setValue(e.target.value)}
      ></input>
    </div>
    <div className={styles.CherryBlossom}>
      { showCherryBlossom && (<CherryBlossom/>)}
    </div>
    <div>
      { showCloud && ( <CloudCanvas/>)}  
      {cats.map((cat, index) => (
        <CatCanvas key={index} x={cat.x} y={cat.y} />
      ))}
    </div>
    <div className={styles.container}>
      <form id="speech-recognition-form">
      <h2>음성 인식</h2>
        {!supported && (
          <p>
            Oh no, it looks like your browser doesn&#39;t support Speech Recognition.
          </p>
        )}
        {supported && (
          <React.Fragment>
            <p>{`'듣기'를 클릭하고 말하기 시작..`}</p>
            {/*<select form="speech-recognition-form" id="language" value={lang}  onChange={(e) => setLang(e.target.value)}>*/}
            {/*  {languageOptions.map((option) => (*/}
            {/*    <option key={option.value} value={option.value}>*/}
            {/*      {option.label}*/}
            {/*    </option>*/}
            {/*  ))}*/}
            {/*</select>*/}
            <label htmlFor="transcript">기록</label>
            <textarea
              id="transcript"
              name="transcript"
              placeholder="음성 기다리는중..."
              value={value}
              rows={3}
              disabled             
              />
            <button disabled={listenBlocked} type="button" onClick={toggle}>
              {listening ? '정지' : '듣기'}
            </button>
            {listenBlocked && <p style={{ color: 'red' }}>The microphone is blocked for this site in your browser.</p>}
            <textarea
              id="extractedValue"
              name="extractedValue"
              placeholder="..."
              value={extractedValue}
              rows={2}
              disabled
              />
          </React.Fragment>
        )}
      </form>

    </div>
    </>
  );
};

export default Example;
