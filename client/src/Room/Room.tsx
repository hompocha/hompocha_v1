import React, { useState,useEffect } from "react";
import { useLocation} from "react-router-dom";
import Parent2 from "../Parent2";
import styles from "./Room.module.css";
function Room() {

const location = useLocation();
const roomName = location.state.roomName;
const idx = location.state.idx;
const nickName = location.state.nickName;

return (
    <>
        <div className={styles.nickName}>{nickName}</div>
        {/*<ParentComponent roomName = {roomName} idx = {idx}/>*/}
        <Parent2 roomName = {roomName} idx = {idx} />
    </>
);
}

export default Room;
