import React, { useEffect, useState } from "react";
import UseSpeechRecognition from "../../voice/useSpeechRecognition";
import SpeechCam from "./SpeechCam";
import styles from "./SpeechGame.module.css";
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";
import LoserCam from "../loserCam/LoserCam";
// import speechClock from "../../sounds/speechClock.wav";
import speechClock from "../../sounds/speechGameSpeed.mp3";
import { effectSound } from "../../effectSound";
import CountDown from "../../Loading/CountDown";
import Loading from "../../Loading/Loading";

let sentenceState = "시작";
const speech_sentence = [
  "간장 공장 공장장은 강 공장장이다",
  "내가 그린 기린 그림은 긴 기린 그림이다",
  "철수 책상 철 책상",
  "상업 산업 사업을 상상한다",
  "앞 집 팥죽은 붉은 팥 풋 팥죽이다",
  "뒷집 콩죽은 햇콩 단콩 콩죽이다",
  "안 촉촉한 초코칩 나라에 살던 안 촉촉한 초코칩",
  "검찰청 창살은 쌍철창살이다",
  "네가 그린 기린 그림은 못생긴 기린 그림이다",
];
const time = [];
for (let i = 20000; i < 50001; i += 100) {
  time.push(i);
}
const SpeechGame = (props) => {
  // let stopTime=5000;
  const [stopTime, setStopTime] = useState(10000);
  const [randomUser, setRandomUser] = useState(props.selectID);
  const hostId = props.selectID;
  const subscribers = props.user.subscribers;
  const [timerExpired, setTimerExpired] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [countDown, setCountDown] = useState(false);
  const [start, setStart] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [isGameOver,setIsGameOver] = useState(false);
  /* 음성인식 on/off를 위한 flag */
  const [speechBlocked, setSpeechBlocked] = useState(false);





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
    if (props.user.streamManager.stream.connection.connectionId === hostId) {
      /* 처음이면 첫번째 랜덤을 돌린다. 시간도 설정한다 . 첫번째 랜덤 문제도 뽑음*/
      if (firstTime === true) {
        setFirstTime(false);
        const firstMembers = [...props.user.subscribers];
        firstMembers.push(props.user.streamManager);
        const selectId =
          getRandomElement(firstMembers).stream.connection.connectionId;
        const sentence = getRandomElement(speech_sentence);
        const randomStopTime = getRandomElement(time);
        sendIdSentence(selectId, sentence);
        sendStopTime(randomStopTime);
      } else {
        /* 두번째부터는 밑에꺼 실행 */
        props.user
          .getStreamManager()
          .stream.session.on("signal:speech", (event) => {
            const sentId = event.data;
            if (sentId === randomUser) {
              const sentence = getRandomElement(speech_sentence);
              const selectId = getRandomElement(findSubscriber(randomUser))
                .stream.connection.connectionId;

              sendIdSentence(selectId, sentence);
            }
          });
      }
    }
    /* 받아서 출력 */
    props.user
      .getStreamManager()
      .stream.session.on("signal:randomId", (event) => {
        const data = JSON.parse(event.data);
        const { id, sentence } = data;
        console.log("애가 바껴야함 : ", id);
        setRandomUser(id);
        sentenceState = sentence;
      });

    props.user
      .getStreamManager()
      .stream.session.on("signal:stopTime", (event) => {
        const data = event.data;
        setStopTime(data);
      });
  }, [props.user, randomUser, stopTime, start]);

  useEffect(() => {
    if (!start) return;
    const bgmSound = effectSound(speechClock, true, 0.3);
    /* 시간 -1초만큼 후에 true(인식X로 변경) */
    const speechTimer = setTimeout(() => {
      setSpeechBlocked(true);

    }, /* stopTime - 1000 */ 39 * 1000);/* 시연*/
    const timer = setTimeout(() => {
      setTimerExpired(true);
      sentenceState="시작";
      bgmSound.stop();
    }, /* stopTime */ 40 * 1000); /*시연*/
    return () => {
      bgmSound.stop();
      clearTimeout(timer);
      clearTimeout(speechTimer);
    };
  }, [stopTime, start]);

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

            <Loading mode={props.mode}/>

          </div>
        )}
        {props.mode === "speechGame" && countDown && (
          <div>
            <CountDown />
          </div>
        )}
        {!timerExpired ? (
          <div className={!loaded ? styles.hidden : ""}>
            <h1>{stopTime}</h1>
            <div className={styles.gameWord}>{sentenceState}</div>
            <div className={styles.speechPosition}>
              <UseSpeechRecognition
                sendSpeech={checkPass}
                user={props.user}
                speechBlocked={speechBlocked}
                mode = {props.mode}
              />
            </div>
            <div className={styles.camPosition}>
              <div className={styles.mainUserCamBorder}></div>
              <div className={styles[`speechGameCam__${0}`]}>
                <SpeechCam key={randomUser} selectId={randomUser} user={props.user} />
              </div>

              {/*=============================딴애들=========================================================*/}
              {findSubscriber(randomUser).map((subscriber, index) => (
                <>
                  <div
                    className={`${styles[`GameSubBorder${index + 1}`]}`}
                  ></div>
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
