import React, { useEffect, useState, useRef } from "react";
import UseSpeechRecognition from "../../voice/useSpeechRecognition";
import SpeechCam from "./SpeechCam";
import styles from "./SpeechGame.module.css";
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";
import LoserCam from "../loserCam/LoserCam";
import speechClock from "../../sounds/speechGameSpeed.mp3";
import { effectSound } from "../../effectSound";
import CountDown from "../../Loading/CountDown";
import Loading from "../../Loading/Loading";
import { TimerBar } from "../Somaek/timer";
import somaekSuccess from "../../sounds/somaekSuccess.wav";

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
  "창경원 창살은 쌍 창살",
  "분당 운중동 한국학중앙연구원",
  "7월 7일은 평창 친구 진정 칠순잔치 날",
  "삼성 설립 사장의 회사 자산 상속자",
  "고려고 교복은 고급 교복",
  "콩깍지는 깐 콩깍지인가 안깐 콩깍지인가",
  "상표 붙인 큰 깡통은 깐 깡통"
];
const time = [];
for (let i = 20000; i < 50001; i += 100) {
  time.push(i);
}
const SpeechGame = (props) => {
  // let stopTime=5000;

  const [stopTime, setStopTime] = useState(10000);
  const [randomUser, setRandomUser] = useState(props.selectID);
  const id = useRef(props.selectID);
  const hostId = props.selectID;
  const subscribers = props.user.subscribers;
  const [timerExpired, setTimerExpired] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [countDown, setCountDown] = useState(false);
  const [start, setStart] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [sentenceState, setSentenceState] = useState("시작");
  /* 음성인식 on/off를 위한 flag */
  const [speechBlocked, setSpeechBlocked] = useState(false);
  const bgmSound = useRef(null);


  const checkvoice = useRef(false);

  /* 준비 신호 받는 세션을 열기위한 useEffect */
  useEffect(() => {
    /* 강제 로딩 3초 줌 */
    setTimeout(() => {
      setLoaded(true);
      sendReadySignal();
    }, 3000);

    /* 내가 호스트일 경우에만, session on 함  */
    if (
      props.user.getStreamManager().stream.connection.connectionId === hostId
    ) {
      let readyPeople = [];
      props.user
        .getStreamManager()
        .stream.session.on("signal:readySignal", (event) => {
          let fromId = event.from.connectionId;
          if (!readyPeople.includes(fromId)) {
            readyPeople.push(fromId);
          }
          if (readyPeople.length === subscribers.length + 1) {
            sendStartSignal();
            props.user
              .getStreamManager()
              .stream.session.off("signal:readySignal");
          }
        });
    }
    /* start 시그널 받는 session on !! */
    props.user
      .getStreamManager()
      .stream.session.on("signal:startSignal", (event) => {
        setCountDown(true);
        /* 3초후에 스타트로 바뀜!*/
        setTimeout(() => {
          setCountDown(false);
          setTimeout(() => {
            setStart(true);
          }, 100);
        }, 3000);
      });
  }, [props.user]);

  useEffect(() => {
    if (!start) return;
    /* 만약에 내가 방장이면 이 밑에서 처리를 해줌 */
    if (firstTime === true) {
      if (props.user.streamManager.stream.connection.connectionId === hostId) {
        /* 처음이면 첫번째 랜덤을 돌린다. 시간도 설정한다 . 첫번째 랜덤 문제도 뽑음*/
        setFirstTime(false);
        const firstMembers = [...props.user.subscribers];
        firstMembers.push(props.user.streamManager);
        const selectId =
          getRandomElement(firstMembers).stream.connection.connectionId;
        const sentence = getRandomElement(speech_sentence);
        const randomStopTime = getRandomElement(time);
        id.current = selectId;
        sendIdSentence(selectId, sentence);
        sendStopTime(randomStopTime);
      }
    }
  }, [props.user, start, firstTime]);

  useEffect(() => {
    if (props.user.streamManager.stream.connection.connectionId === hostId) {
      /* 두번째부터는 밑에꺼 실행 */
      const receivePassedConId = (event) => {
        const sentId = event.data;
        if (sentId === id.current) {
          const sentence = getRandomElement(speech_sentence);
          const selectId = getRandomElement(findSubscriber(id.current)).stream
            .connection.connectionId;
          id.current = selectId;
          sendIdSentence(selectId, sentence);
        }
      };
      props.user
        .getStreamManager()
        .stream.session.on("signal:speech", receivePassedConId);
    }
    const receiveRandomId = (event) => {
      const data = JSON.parse(event.data);
      const { id, sentence } = data;
      console.log("애가 바껴야함 : ", id);
      setRandomUser(id);
      effectSound(somaekSuccess);
      setSentenceState(sentence);
      // 뒤에꺼 boolean으로 받음
      checkvoice.current = props.user.getStreamManager().stream.connection.connectionId === id;
    };
    const receiveStopTime = (event) => {
      const data = event.data;
      setStopTime(data);
    };
    props.user
      .getStreamManager()
      .stream.session.on("signal:randomId", receiveRandomId);
    props.user
      .getStreamManager()
      .stream.session.on("signal:stopTime", receiveStopTime);
  }, [props.user]);

  useEffect(() => {
    if (!start) return;
    bgmSound.current = effectSound(speechClock, true, 0.3);
    return () => {
      if (bgmSound.current) bgmSound.current.stop();
    };
  }, [stopTime, start]);

  const gameEnd = () => {
    setSpeechBlocked(true);
    setTimeout(() => {
      setTimerExpired(true);
      setSentenceState("시작");
      bgmSound.current.stop();
    }, 1500);
  };

  useEffect(() => {
    if (props.voice === false) {
      setSpeechBlocked(true);
      const timer = setTimeout(() => {
        props.voiceOn();
        props.end();
      }, 1500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [props.voice]);

  /*signal 보내는데 맞춘사람 id보냄*/
  function checkPass(sentId) {
    if (props.user.getStreamManager().session) {
      props.user
        .getStreamManager()
        .session.signal({
          data: sentId,
          to: [],
          type: "speech",
        })
        .then(() => {
          console.log("sentence sent_id sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function sendStopTime(stopTime) {
    if (props.user.getStreamManager().session) {
      props.user
        .getStreamManager()
        .session.signal({
          data: stopTime,
          to: [],
          type: "stopTime",
        })
        .then(() => {
          console.log("sentence sent_id sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  /* signal 보내는데 랜덤으로 고른 아이디랑 문장 보냄*/
  function sendIdSentence(id, sentence) {
    if (props.user.getStreamManager().session) {
      props.user
        .getStreamManager()
        .session.signal({
          data: JSON.stringify({ id, sentence }),
          to: [],
          type: "randomId",
        })
        .then(() => {
          console.log("user id sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  /*게임 로드 후 레디 시그널 전송 */
  const sendReadySignal = () => {
    props.user
      .getStreamManager()
      .session.signal({
        to: [],
        type: "readySignal",
      })
      .then(() => {
        console.log("readySignal successfully sent");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /*게임 시작 시그널 전송*/
  const sendStartSignal = () => {
    props.user
      .getStreamManager()
      .session.signal({
        to: [],
        type: "startSignal",
      })
      .then(() => {
        console.log("startSignal successfully sent");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /* 랜덤요소 고르는 함수 */
  function getRandomElement(list) {
    if (list.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  /*===========id를 통해서 subscribers 찾기 ============*/
  function findSubscriber(wantId) {
    const firstMembers = [...props.user.subscribers];
    firstMembers.push(props.user.streamManager);
    return firstMembers.filter(
      (subscriber) => subscriber.stream.connection.connectionId !== wantId
    );
  }
  /*================================================*/

  /*======================================================= */
  /*=================== return =================== */
  /*======================================================= */

  return (
    <>
      <div>
        {props.mode === "speechGame" && !loaded && (
          <div>
            <Loading mode={props.mode} />
          </div>
        )}
        {props.mode === "speechGame" && countDown && (
          <div>
            <CountDown />
          </div>
        )}
        {!timerExpired ? (
          <div className={!loaded ? styles.hidden : ""}>
            <div className={styles.gameWord}>{sentenceState}</div>
            <div className={styles.speechPosition}>
              <UseSpeechRecognition
                sendSpeech={checkPass}
                user={props.user}
                speechBlocked={speechBlocked}
                mode={props.mode}
                checkvoice = {checkvoice}
              />
            </div>
            <div className={styles.camPosition}>
              <div className={styles.mainUserCamBorder}></div>
              <div className={styles[`speechGameCam__${0}`]}>
                <SpeechCam
                  key={randomUser}
                  selectId={randomUser}
                  user={props.user}
                />
              </div>
              <TimerBar timeMax={40 * 1000} gameEnd={gameEnd} start={start} />

              {/*=============================딴애들=========================================================*/}
              {findSubscriber(randomUser).map((subscriber, index) => (
                <>
                  <div className={styles[`speechGameCam__${index + 1}`]}>
                    <OpenViduVideoComponent
                      key={randomUser}
                      mode={"speechGame"}
                      streamManager={subscriber}
                    />
                  </div>
                  <div className={styles[`userNick${index + 1}`]}>
                    {props.conToNick[subscriber.stream.connection.connectionId]}
                  </div>
                </>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <LoserCam
              selectId={randomUser}
              user={props.user}
              mode={"centerCam"}
              end={props.end}
              conToNick={props.conToNick}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SpeechGame;
