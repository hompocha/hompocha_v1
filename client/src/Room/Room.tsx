import React, { useState,useEffect } from "react";
import CamFour from "../cam/CamFour";
import SpeechRecognitionExample from '../voice/useSpeechRecognition';
import CloudCanvas from '../keyword/cloud';
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
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/keyword`);
            const { keywords } = response.data;
            for (const keyword of keywords) {
                setExtractedValue(keyword);
                break;
            }
        } catch (error) {
            console.error(error);
        }
        };
        fetchData();
    });
function onSubmitEnterRoom(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    showCam(userNum);
}
return (
    <div>
        
        <SpeechRecognitionExample/>
        <CamFour />
    {/* <div className="comment">
        <div>방 메인 화면 입니다.</div>
        <div>
        유저 수에 따라 CamOne ~ CamSix를 불러오도록 설계하려고 합니다.
        </div>
        <div>카메라 : 반지름은 400px로 고정</div>
    </div>
    <br />
    <br />
    <div className="countUserNum">
        <div>현재 방 유저의 수</div>
        <input
        id = "inn"
        type="number"
        placeholder="현재 유저의 수"
        value={userNum}
        onChange={(e) => setUserNum(Number(e.target.value))}
        />
        <button type="submit" onClick={onSubmitEnterRoom}>
        입장 {userNum}
        </button>
    </div> */}
    </div>
);
}

export default Room;
