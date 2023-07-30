// Lobby.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Lobby.module.css";
import UserList from "./UserList";
import RoomList from "./RoomList";
// import {Link} from 'react-router-dom';
import axios from "axios";

const Lobby = () => {
  const [loginId, setLoginId] = useState<string>("");
  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  }, [navigate]);

  // const image1 = new Image();
  // image1.src = "/Menu/menu1.png";
  // const image2 = new Image();
  // image2.src = "/Menu/menu2.png";

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
        console.log(response);
        setLoginId(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
    {/* <div className={styles.menu1}>
      <img src="/menu/menu1.png"></img>
    </div>
    <div className={styles.menu2}>
      <img src="/menu/menu2.png"></img>
    </div> */}
      <div className={styles.lobbyWrap}>
        <div className={styles.lobbyInfo}>
          <RoomList />
          <UserList />
        </div>
      </div>
      <div className={styles.nav}>
        <div className={styles.userName}>{loginId}</div>
        <div className={styles.logoutBtn}>
          <input onClick={handleLogout} type="button" value="로그아웃" />
        </div>
      </div>
    </>
  );
};

export default Lobby;
