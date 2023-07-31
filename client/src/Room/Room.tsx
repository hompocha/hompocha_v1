import React, { useState,useEffect } from "react";
import { useLocation} from "react-router-dom";
import Parent2 from "../Parent2";
function Room() {

const location = useLocation();
const roomName = location.state.roomName;
const idx = location.state.idx;

return (
    <>
        {/*<ParentComponent roomName = {roomName} idx = {idx}/>*/}
        <Parent2 roomName = {roomName} idx = {idx}/>
    </>
);
}

export default Room;
