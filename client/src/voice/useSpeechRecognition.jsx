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




const keyword = ["고양이", "구름", "벚꽃"];
const languageOptions = [{ label: '한국어 - ', value: 'ko-KR' }];

const Example = (props) => {

  const [lang, setLang] = useState('ko-KR');
  const [value, setValue] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [extractedValue, setExtractedValue] = useState('');



  useEffect(() => {
    for (const word of keyword) {
      if (value.includes(word)) {
        setExtractedValue(word);
        props.sendSignal(word);
        break;
      }
    }
  }, [value]);

  
  const onEnd = () => {
    // You could do something here after listening has finished
  };

  const onResult = (result) => {
    setValue(result);
  };

  const onError = (event) => {
    if (event.error === 'not-allowed') {
      setBlocked(true);
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
        setBlocked(false);
        listen({ lang });
      };
  
  return (
    <>


      <div className={styles.CherryBlossom}>
      {/* <Room extractedValue = {extractedValue}/> */}
      { extractedValue === "벚꽃" && (<CherryBlossom/>)}
    </div>
    <div>
      { extractedValue === "구름" && ( <CloudCanvas/>)}
      { extractedValue === "고양이" && ( <Cat/>)} 
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
            <select form="speech-recognition-form" id="language" value={lang}  onChange={(e) => setLang(e.target.value)}>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor="transcript">기록</label>
            <textarea
              id="transcript"
              name="transcript"
              placeholder="음성 기다리는중..."
              value={value}
              rows={3}
              disabled             
              />
            <button disabled={blocked} type="button" onClick={toggle}>
              {listening ? '정지' : '듣기'}
            </button>
            {blocked && <p style={{ color: 'red' }}>The microphone is blocked for this site in your browser.</p>}
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
