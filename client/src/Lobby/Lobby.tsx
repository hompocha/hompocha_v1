// Lobby.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Lobby.module.css';
import RoomInfo from './RoomInfo';
import RoomCreate from './RoomCreate';
import UserList from './UserList';
// import {Link} from 'react-router-dom';
import axios from 'axios';

const Lobby = () => {
  const [sc, setSc] = useState<string>("");
  const [loginId, setLoginId] = useState<string>("");
  const [flag, setFlag] = useState<number>(0);
  const navigate = useNavigate();

  const RoomListOrCreate = () => {
    setFlag((prevFlag) => (prevFlag === 0 ? 1 : 0));
  }
  const handleLogout = useCallback(() => {
    navigate(-1);
  }, [navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/idPost');
        setLoginId(response.data.id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h4> {loginId} </h4>

      <div>
        <UserList />
      </div>
      <div>
            {flag === 0 && <button type='submit' onClick={RoomListOrCreate}> 방 생성</button>}
            {flag !== 0 && <button type='submit' onClick={RoomListOrCreate}> 닫기</button>}
          </div>
          <div>
            {flag === 0 && (<RoomInfo />)}
            {flag !== 0 && (<RoomCreate />)}
      </div>
        <button type='submit' onClick={handleLogout}>로그아웃</button>
    </>
  );
};

export default Lobby;
