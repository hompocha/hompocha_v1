import React, { useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Parent2 from "../Parent2";
import styles from "./Room.module.css";
import Login from "../Log/Login";
function Room() {

    const location = useLocation();
    const navigate = useNavigate()
    const roomName = location.state ? location.state.roomName : null;
    const idx = location.state ? location.state.idx : null;
    const nickName = location.state ? location.state.nickName: null;

    useEffect(() => {
        if (roomName === null || idx === null || nickName === null) {
            alert("잘못된 접근입니다!");
            navigate("/");
        }
    }, [roomName, idx, nickName, navigate]);

    if(roomName ===null || idx ===null || nickName ===null){
        return (
            <>
                <Login/>
            </>
        )
    }else{
        return (
            <>
                {/* <h2 className={styles.nickName}>{nickName}</h2> */}
                {/*<ParentComponent roomName = {roomName} idx = {idx}/>*/}
                <Parent2 roomName = {roomName} idx = {idx} />
            </>
        );
    }
}

export default Room;