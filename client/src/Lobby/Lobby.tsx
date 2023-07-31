// Lobby.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Lobby.module.css";
import UserList from "./UserList";
import RoomList from "./RoomList";
// import {Link} from 'react-router-dom';
import axios from "axios";
import RoomCreate from "./RoomCreate";

const Lobby = () => {
  const [loginId, setLoginId] = useState<string>("");
  const [flag, setFlag] = useState(0);
  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        if (jwtToken) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/lobby`
        );
        console.log(response.data);
        setLoginId(response.data);
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
          <RoomList />
          {/* <UserList /> */}
        </div>
      </div>
      <div className={styles.nav}>
        <div className={styles.userName}>{loginId}</div>
        <div className={styles.logoutBtn}>
          <input onClick={handleLogout} type="button" value="로그아웃" />
        </div>
      </div>
      { flag === 1 && 
        <div className={styles.roomCreateWrap}>
          <RoomCreate/>
        </div>
      }
    </>
  );
};

export default Lobby;
