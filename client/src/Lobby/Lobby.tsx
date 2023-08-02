// Lobby.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Lobby.module.css";
import RoomList from "./RoomList";
import axios from "axios";
import RoomCreate from "./RoomCreate";

const Lobby = () => {
  const [nickName, setNickname] = useState<string>("");
  const [flag, setFlag] = useState(0);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        console.log("token")
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/lobby`,{
          headers: {
            Authorization: `Bearer ${token}`, // 요청 헤더에 토큰을 포함하여 서버에 전송
          },});
        setNickname(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleOptionClick = () =>{
    setFlag((prevFlag) => (prevFlag === 0 ? 1 : 0));
  }

  return (
    <>
  
    <div className={styles.option} onClick={handleOptionClick} tabIndex={0} role="button">방 생성</div>
      <div className={styles.lobbyWrap}>
        <div className={styles.lobbyInfo}>
          <RoomList nickName = {nickName}/>
          {/* <UserList /> */}
        </div>
      </div>
      <div className={styles.nav}>
        <div className={styles.userName}>{nickName}</div>
        <div className={styles.logoutBtn}>
          <input onClick={handleLogout} type="button" value="로그아웃" />
        </div>
      </div>
      { flag === 1 && 
        <div className={styles.roomCreateWrap}>
          <RoomCreate nickName = {nickName}/>
        </div>
      }
    </>
  );
};

export default Lobby;
