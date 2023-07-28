import React, {useEffect, useRef, useState} from "react";
import UseSpeechRecognition from "../../voice/useSpeechRecognition";
import SpeechCam from './SpeechCam';
import styles from './SpeechGame.module.css';
import OpenViduVideoComponent from "../../cam/OpenViduVideoComponent";


let firstTime = true;
let sentenceState = '시작'
const speech_sentence = ["간장 공장 공장장은 강 공장장이다","내가 그린 기린그림은 긴 기린그림이다","철수책상철책상"]
const SpeechGame = (props) => {
    // const [sentenceState, setSpeech] = useState('시작');
    // let sentenceSate = '시작'
    const [randomUser, setRandomUser] = useState(props.selectID);
    const hostIp = props.selectID;
    // let randomUser = chooseRandomMember();

    // const speechRef = useRef('')
    useEffect(() => {
        /* 만약에 내가 방장이면 이 밑에서 처리를 해줌 */
        if (props.user.streamManager.stream.connection.connectionId === hostIp)
        {
          /* 처음 시작할때 랜덤으로 돌려서 보내버리기~!!!*/
          if (firstTime === true)
          {
            firstTime = false;
            const sentence = getRandomElement(speech_sentence)
            // setRandomUser(chooseRandomMember());
            console.log("첫번째로 걸린애: ", chooseRandomMember());
            sendPasstoUser(chooseRandomMember(),sentence);
            // sentenceState=sentence
          }
          /* 두번째부터는 밑에꺼 실행 */
          else
          {
            props.user.getStreamManager().stream.session.on("signal:speech", (event) => {
                const sentId = event.data;
                console.log("메세지 보낸애: ", sentId);
                console.log("첫시작으로 걸렸으면서, 맞춰야하는데: ", randomUser);

            /* 술래가 제대로 발음한 시그널을 받았을 경우 */
                if (sentId === randomUser) {
                    const sentence = getRandomElement(speech_sentence)
                    console.log("걸린애 : ", chooseRandomMember());
                  setRandomUser(chooseRandomMember());

                    sendPasstoUser(chooseRandomMember(),sentence);
                  sentenceState=sentence
                }
            });
          }
        }
        /* 호스트 아닌 애들은 그냥 받기만해서 영상 출력해버리면 되는거 아님?*/
      props.user.getStreamManager().stream.session.on("signal:randomId", (event) => {
        const data = JSON.parse(event.data);
        const {id ,sentence} = data;
        console.log("애가 바껴야함 : ",id);
        setRandomUser(id);
        sentenceState=sentence;
      })
    }, [props.user]);

  /*================================*/
  /*signal 보내는데 맞춘사람 id보냄*/
    function sendPass(sentId) {
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
    function sendPasstoUser(id,sentence) {
      if (props.user.getStreamManager().session) {
        props.user.getStreamManager().session
          .signal({
            data: JSON.stringify({id,sentence}),
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
  /*================================*/
  /* 랜덤으로 멤버 고름요*/
  function chooseRandomMember()
  {
    const firstMembers = [...props.user.subscribers];
    firstMembers.push(props.user.streamManager);
    return getRandomElement(firstMembers).stream.connection.connectionId;
  }
  /*================================*/
  /* 랜덤요소 고르는 함수 */
    function getRandomElement(list) {
        if (list.length === 0) {
            console.log("여기 Null 값이다.")
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
    const a =firstMembers.filter(
      (subscriber) => subscriber.stream.connection.connectionId !==wantId
    )
    console.log("Asdfasdfasdf",a);
    return a
  }
  /*================================================*/

    return (
        <div>
            {/* UserVideoComponent 위에 불투명 레이어를 추가합니다. */}
            <h1 className={styles.gameWord}>{sentenceState}</h1>
            <div className={styles.speechPosition}>
              <UseSpeechRecognition sendSpeech={sendPass} user={props.user}/>
            </div>
            <div className={styles.camPosition}>
              {/*========================테스트입니다=============================*/}
              <h1>{randomUser}</h1>
              <h1>{hostIp}</h1>
              <h1>{props.user.streamManager.stream.connection.connectionId}</h1>
              {/*========================여기까지================================*/}

              <SpeechCam selectId={randomUser} user={props.user}/>

              {/*=============================딴애들=========================================================*/}
              {
                findSubscriber(randomUser).map((subscriber) => (
                  <>
                    <h1>{subscriber.stream.connection.connectionId}</h1>
                    <OpenViduVideoComponent mode={undefined} streamManager={subscriber} />
                  </>
                ))
              }
              {/*==========================================================================================*/}




            </div>
        </div>
    );
}
export default SpeechGame;