import React, { useState,useEffect } from "react";
import CamFour from "../cam/CamFour";
import SpeechRecognitionExample from '../voice/useSpeechRecognition';
import CloudCanvas from '../keyword/cloud';
import CheeryBlossom from "../keyword/cherryBlossom";
import axios from 'axios';
function Room() {
const [userNum, setUserNum] = useState<number>(0);
// const [flag, setFlag] = useState<number>(0);
const [value, setValue] = useState('');
const [extractedValue, setExtractedValue] = useState('');

function showCam(userNumValue:number){
    switch (userNumValue) {
    case 1:
        console.log('입장', userNumValue);
        break;

    default:
        break;
    }
}
function onSubmitEnterRoom(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    showCam(userNum);
}
return (
    <div>
        <SpeechRecognitionExample/>
        <CamFour />
    </div>
);
}

export default Room;