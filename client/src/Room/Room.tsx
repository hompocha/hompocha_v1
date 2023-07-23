import React, { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParentComponent from "../ParentComponent";
function Room() {
const [userNum, setUserNum] = useState<number>(0);
const [flag, setFlag] = useState<number>(0);
const [value, setValue] = useState('');
const [extractedValue, setExtractedValue] = useState('');
const navigate = useNavigate();

const location = useLocation();
const roomName = location.state.roomName;
const idx = location.state.idx;
console.log(location.state.idx);
// function showCam(userNumValue:number){
//     switch (userNumValue) {
//     case 1:
//         console.log('입장', userNumValue);
//         break;

//     default:
//         break;
//     }
// // }
// function onSubmitEnterRoom(event: React.MouseEvent<HTMLButtonElement>) {
//     event.preventDefault();
//     showCam(userNum);
// }
return (
    <>
    
    <h2>
        {roomName}
    </h2>
    <div>
        {/* {navigate('/ParentComponent', { state: { roomName: roomName } })} */}
        {/* <Link to = "/Room" roomName = {roomName}/>Link> */}
        <ParentComponent roomName = {roomName} idx = {idx}/>
    </div>
    
    </>
);
}

export default Room;
