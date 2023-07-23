import React, { useState,useEffect } from "react";

import ParentComponent from "../ParentComponent";
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
        <ParentComponent />
    </div>
);
}

export default Room;
