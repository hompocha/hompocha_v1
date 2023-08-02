import React, { useEffect, useState } from "react";
import UseSpeechRecognition from "../../voice/useSpeechRecognition";
import SpeechCam from "./SpeechCam";
import styles from "./SpeechGame.module.css";
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";
import LoserCam from "../loserCam/LoserCam";

let sentenceState = "시작";
const speech_sentence = [
  "간장 공장 공장장은 강 공장장이다",
  "내가 그린 기린 그림은 긴 기린 그림이다",
  "철수 책상 철 책상",
  "상업 산업 사업을 상상한다",
  "앞 집 팥죽은 붉은 팥 풋 팥죽이다",
  "뒷집 콩죽은 햇콩 단콩 콩죽이다",
  "안 촉촉한 초코칩 나라에 살던 안 촉촉한 초코칩",
  "경찰청 창살은 외철창살이다",
  "검찰청 창살은 쌍철창살이다",
  "네가 그린 기린 그림은 못생긴 기린 그림이다"
];
const time = [];
for (let i = 20000; i < 50001; i += 100) {
  time.push(i);
}
const SpeechGame = (props) => {
  // let stopTime=5000;
  const [stopTime, setStopTime] = useState(5000);
  const [randomUser, setRandomUser] = useState(props.selectID);
  const hostIp = props.selectID;
  const [timerExpired, setTimerExpired] = useState(false);
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    /* 만약에 내가 방장이면 이 밑에서 처리를 해줌 */
    if (props.user.streamManager.stream.connection.connectionId === hostIp) {
      if (firstTime === true) {
        setFirstTime(false);
        const firstMembers = [...props.user.subscribers];
        firstMembers.push(props.user.streamManager);
        const selectId =
          getRandomElement(firstMembers).stream.connection.connectionId;
        const sentence = getRandomElement(speech_sentence);
        const randomStopTime = getRandomElement(time);
        sendToUsers(selectId, sentence);
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

              sendToUsers(selectId, sentence);
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
  }, [props.user, randomUser, stopTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimerExpired(true);
    }, /*stopTime*/ 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [stopTime]);

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
  /* signal 보내는데 랜덤으로 고른 아이디랑 문장보냄*/
  function sendToUsers(id, sentence) {
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
      (subscriber) => subscriber.stream.connection.connectionId !== wantId,
    );
  }
  /*================================================*/

  return (
    <>
      {!timerExpired ? (
        <div>
          <h1>{stopTime}</h1>
          <div className={styles.gameWord}>{sentenceState}</div>
          <div className={styles.speechPosition}>
            <UseSpeechRecognition sendSpeech={checkPass} user={props.user} />
          </div>
          <div className={styles.camPosition}>
            {/*========================테스트입니다=============================*/}
            <div className={styles.text}>
              <h4>{randomUser}</h4>
              <h4>{hostIp}</h4>
              <h4>{stopTime}</h4>
              <h4>{props.user.streamManager.stream.connection.connectionId}</h4>
            </div>

            {/*========================여기까지================================*/}
            <div className={styles[`speechGameCam__${0}`]}>
              <SpeechCam selectId={randomUser} user={props.user} />
            </div>

            {/*=============================딴애들=========================================================*/}
            {findSubscriber(randomUser).map((subscriber, index) => (
              <>
                <div className={styles[`speechGameCam__${index + 1}`]}>
                  <OpenViduVideoComponent
                    mode={"speechGame"}
                    streamManager={subscriber}
                  />
                </div>
                <div className={styles[`userNick${index + 1}`]}>
                  {props.conToNick[subscriber.stream.connection.connectionId]}
                </div>
              </>
            ))}
            {/*==========================================================================================*/}
          </div>
        </div>
      ) : (
        <div>
          <LoserCam
            selectId={randomUser}
            user={props.user}
            mode={"centerCam"}
            end={props.end}
          />
        </div>
      )}
    </>
  );
};

export default SpeechGame;
