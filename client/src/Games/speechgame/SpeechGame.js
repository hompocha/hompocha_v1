import React, {useEffect, useRef, useState} from "react";
import UseSpeechRecognition from "../../voice/useSpeechRecognition";
import SpeechCam from './SpeechCam';
import styles from './SpeechGame.module.css';
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";


let sentenceState = '시작'
const speech_sentence = ["간장 공장 공장장은 강 공장장이다","내가 그린 기린 그림은 긴 기린 그림이다","철수 책상 철 책상","상업 산업 사업을 상상한다"]
const time = []
for(let i =10000; i < 50001; i+=100){
  time.push(i);
}
const SpeechGame = (props) => {
  // let stopTime=5000;
  const [stopTime,setStopTime] = useState(5000);
    const [randomUser, setRandomUser] = useState(props.selectID);
    const hostIp = props.selectID;
  const [timerExpired, setTimerExpired] = useState(false);
  const [firstTime,setFirstTime]= useState(true);


    useEffect(() => {
        console.log('useeffect');
        /* 만약에 내가 방장이면 이 밑에서 처리를 해줌 */
        if (props.user.streamManager.stream.connection.connectionId === hostIp)
        {
          console.log('host');
          /* 처음 시작할때 랜덤으로 돌려서 보내버리기~!!!*/
          if (firstTime === true)
          {
            setFirstTime(false);
            const firstMembers = [...props.user.subscribers];
            firstMembers.push(props.user.streamManager);
            const selectId =getRandomElement(firstMembers).stream.connection.connectionId;
            const sentence = getRandomElement(speech_sentence);
            const sendStopTime=getRandomElement(time);
            // setRandomUser(chooseRandomMember());
            console.log("첫번째로 걸린애: ", selectId);
            sendToUsers(selectId,sentence,sendStopTime);
            // sentenceState=sentence
          }
          /* 두번째부터는 밑에꺼 실행 */
          else
          {
            console.log("여기로 못들어옴? ")
            props.user.getStreamManager().stream.session.on("signal:speech", (event) => {
                const sentId = event.data;
                console.log("메세지 보낸애: ", sentId);
                console.log("첫시작으로 걸렸으면서, 맞춰야하는데: ", randomUser);
                if (sentId === randomUser) {
                    const sentence = getRandomElement(speech_sentence)
                  const selectId = getRandomElement(findSubscriber(randomUser)).stream.connection.connectionId;
                  const sendStopTime=stopTime
                    console.log("걸린애 : ", selectId);
                    sendToUsers(selectId,sentence,sendStopTime);
                }
            });
          }
        }
        /* 받아서 출력 */
      props.user.getStreamManager().stream.session.on("signal:randomId", (event) => {
        const data = JSON.parse(event.data);
        const {id ,sentence,sendStopTime} = data;
        console.log(sendStopTime);
        console.log("애가 바껴야함 : ",id);
        setRandomUser(id);
        sentenceState=sentence;
        setStopTime(sendStopTime)
      })
    }, [props.user,randomUser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimerExpired(true);
    }, stopTime);
    return () => {
      clearTimeout(timer);
    }
  }, [stopTime]);

  useEffect(() => {
    if(timerExpired) {
      const timer = setTimeout(() => {
        setFirstTime(false);
        props.end(undefined);
      }, 2000);

      return () => {
        clearTimeout(timer);}
    }
  }, [timerExpired, props]);

  /*================================*/
  /*signal 보내는데 맞춘사람 id보냄*/
    function checkPass(sentId) {
        if (props.user.getStreamManager().session) {
            props.user.getStreamManager().session
                .signal({
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
  /*================================*/
    /* signal 보내는데 랜덤으로 고른 아이디랑 문장보냄*/
    function sendToUsers(id,sentence,sendStopTime) {
      if (props.user.getStreamManager().session) {
        props.user.getStreamManager().session
          .signal({
            data: JSON.stringify({id,sentence,sendStopTime}),
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
  /*================================*/

  /*===========id를 통해서 subscribers 찾기 ============*/
  function findSubscriber(wantId){
    const firstMembers = [...props.user.subscribers];
    firstMembers.push(props.user.streamManager);
    return firstMembers.filter(
      (subscriber) => subscriber.stream.connection.connectionId !==wantId
    )
  }
  /*================================================*/

    return (
      <>
      {!timerExpired ? (
        <div>
            <h1 className={styles.gameWord}>{sentenceState}</h1>
            <div className={styles.speechPosition}>
              <UseSpeechRecognition sendSpeech={checkPass} user={props.user}/>
            </div>
            <div className={styles.camPosition}>
              {/*========================테스트입니다=============================*/}
              <h1>{randomUser}</h1>
              <h1>{hostIp}</h1>
              <h1>{stopTime}</h1>
              <h1>{props.user.streamManager.stream.connection.connectionId}</h1>
              {/*========================여기까지================================*/}

              <SpeechCam selectId={randomUser} user={props.user}/>

              {/*=============================딴애들=========================================================*/}
              {
                findSubscriber(randomUser).map((subscriber, index) => (
                  <React.Fragment key={index}>
                    <h1>{subscriber.stream.connection.connectionId}</h1>
                    <OpenViduVideoComponent mode={undefined} streamManager={subscriber} />
                  </React.Fragment>
                ))
              }
              {/*==========================================================================================*/}
            </div>
        </div>
      ):
        <div>
          <h1>애가 마지막에 걸린애</h1>
          <SpeechCam selectId={randomUser} user={props.user}/>
        </div>
      }
      </>
    );
}


export default SpeechGame;