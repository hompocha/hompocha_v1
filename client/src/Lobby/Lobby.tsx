// Lobby.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Lobby.module.css";
import RoomList from "./RoomList";
import axios from "axios";
import RoomCreate from "./RoomCreate";
import { createBrowserHistory } from "history";
import Login from "../Log/Login";

const Lobby = () => {
  const [nickName, setNickname] = useState<string>("");
  const [flag, setFlag] = useState(0);
  const navigate = useNavigate();
  const history = createBrowserHistory();
  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const handleHistoryPop = () => {
      localStorage.removeItem("jwtToken");
      history.push("/");
    };
    const unlistenHistoryEvent = history.listen(({ action }) => {
      if (action === "POP") {
        handleHistoryPop();
      }
    });
    return () => {
      unlistenHistoryEvent();
    };
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("잘못된 접근입니다!");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        console.log("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/lobby`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 요청 헤더에 토큰을 포함하여 서버에 전송
            },
          }
        );
        setNickname(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleOptionClick = () => {
    setFlag((prevFlag) => (prevFlag === 0 ? 1 : 0));
  };
  const bg_img = `${styles.themePocha}`;
  if (!localStorage.getItem("jwtToken")) {
    return (
      <>
        <Login />
      </>
    );
  } else {
    return (
      <>
        <div className={bg_img}></div>
        <div
          className={styles.option}
          onClick={handleOptionClick}
          tabIndex={0}
          role="button"
        >
          방 생성
        </div>
        <div className={styles.lobbyWrap}>
          <div className={styles.lobbyInfo}>
            <RoomList nickName={nickName} />
          </div>
        </div>
        <div className={styles.nav}>
          <div className={styles.userName}>{nickName}</div>
          <div onClick={handleLogout} className={styles.logoutBtn}></div>
        </div>
        {flag === 1 && (
          <div className={styles.roomCreateWrap}>
            <RoomCreate nickName={nickName} />
          </div>
        )}
      </>
    );
  }
};

export default Lobby;
