import React, {useEffect, useRef, useState} from "react";
import UseSpeechRecognition from "../../voice/useSpeechRecognition";
import SpeechCam from "./SpeechCam";



const speech_sentence = ["간장 공장 공장장은 강 공장장이다","내가 그린 기린그림은 긴 기린그림이다","철수책상철책상"]
const SpeechGame = (props) => {
    const [sentenceState, setSpeech] = useState('시작');
    // const [randomUser, setRandomUser] = useState(props.selectID);
    const hostIp = props.selectID;
    let randomUser = props.selectID;
    // const speechRef = useRef('')
    useEffect(() => {
        /* 만약에 내가 방장이면 이 밑에서 처리를 해줌 */
        if (props.user.streamManager.stream.connection.connectionId === hostIp){
            props.user.getStreamManager().stream.session.on("signal:speech", (event) => {
                const sentId = event.data;
                console.log("메세지 보내는 애: ", sentId);
                console.log("시작하는애였다가 맞추면 바꿔지는 애, 애가 맞춰야 함 아니면 안됨 : ", randomUser);

            /* 술래가 제대로 발음한 시그널을 받았을 경우 */
                if (sentId === randomUser) {
                    const peopleList = [...props.user.subscribers];
                    peopleList.push(props.user.streamManager);
                    const selectedUser = getRandomElement(peopleList).stream.connection.connectionId;
                  const sentence = getRandomElement(speech_sentence)

                    // setRandomUser(selectedUser);
                  randomUser=selectedUser;
                    console.log("걸린애 : ", selectedUser);
                  sendPasstoUser(selectedUser,sentence);
                  setSpeech(sentence)
                }
            });
        }
        /* 호스트 아닌 애들은 그냥 받기만해서 영상 출력해버리면 되는거 아님?*/
        else{
            props.user.getStreamManager().stream.session.on("signal:randomId", (event) => {
                const data = JSON.parse(event.data);
                const {id ,sentence} = data;
                console.log("애가 바껴야함 : ",id);
              randomUser = id;
              setSpeech(sentence);

            })
        }
    }, [props.user]);
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
    function getRandomElement(list) {
        if (list.length === 0) {
            console.log("여기 Null 값이다.")
            return null;
        }
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }
    return (
        <div>
            {/* UserVideoComponent 위에 불투명 레이어를 추가합니다. */}
            {/*다른 사람 나오는거 같긴한데 잘모르겠다*/}
            <h1>{sentenceState}</h1>
            <UseSpeechRecognition sendSpeech={sendPass} user={props.user}/>
            <SpeechCam selectId={randomUser} user={props.user}/>
        </div>
    );
}
export default SpeechGame;