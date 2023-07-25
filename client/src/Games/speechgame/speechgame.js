import React, { useEffect, useState } from "react";
import UserVideoComponent from "../../cam/UserVideoComponent";

const Speechgame = (props) => {
    const [speech, setSpeech] = useState(false);
    const [random , setRandom] =useState('');

    useEffect(() => {
        props.user.getStreamManager().stream.session.on("signal:speech", (event) => {
            const data = event.data;
            const people = props.user.getSubscriber();
            const randomElement = getRandomElement(people);
            console.log("test:" ,randomElement.stream.connection.connectionId);
            console.log("my ID : ", props.user.getStreamManager().stream.connection.connectionId)
            setRandom(randomElement);
        });
    }, [props.user]);

    // const sendPass = () => {
    //     if (props.user && speech) {
    //         const data = { speech: false, streamId: props.user.getStreamManager().stream.streamId };
    //         props.user.getStreamManager().stream.session.signal({
    //             data: JSON.stringify(data),
    //             to: [],
    //             type: 'speech',
    //         });
    //     }
    // };
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
            <UserVideoComponent streamManager={random}/>

        </div>

    );
};

export default Speechgame;