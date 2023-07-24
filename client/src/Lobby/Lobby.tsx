// Lobby.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Lobby.module.css';
import UserList from './UserList';
import RoomList from './RoomList';
// import {Link} from 'react-router-dom';
import axios from 'axios';

const Lobby = () => {
  const [loginId, setLoginId] = useState<string>("");
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  }, [navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
          const jwtToken = localStorage.getItem('jwtToken');
          if(jwtToken){
              axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
          }
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/lobby`);
          console.log(response.data)
          setLoginId(response.data);

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return  (
    <>
      <div className={styles.name}>
        <h4> {loginId} </h4>
      </div>
      <div className={styles.roomList}>
        <RoomList/>
      </div>
      <div className={styles.userList}>
        <UserList />
      </div>
      <div className={styles.logout}>
        <button type='submit' onClick={handleLogout}>로그아웃</button>
      </div>
    </>
  );
};

export default Lobby;