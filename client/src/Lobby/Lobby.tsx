// Lobby.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Lobby.module.css';
import RoomInfo from './RoomInfo';
import RoomCreate from './RoomCreate';
import UserList from './UserList';
import RoomList from './RoomList';
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
      <h4> {loginId} </h4>
      <div>
        <RoomList/>
      </div>
      <div>
        <UserList />
      </div>
      <div>
            {flag === 0 && <button type='submit' onClick={RoomListOrCreate}> 방 생성</button>}
            {flag !== 0 && <button type='submit' onClick={RoomListOrCreate}> 닫기</button>}
          </div>
          <div style={{position : "fixed", marginLeft : "30%" , marginTop : "30%"}}>
            {flag === 0 && (<RoomInfo />)}
            {flag !== 0 && (<RoomCreate />)}
      </div>
        <button type='submit' onClick={handleLogout}>로그아웃</button>
    </>
  );
};

export default Lobby;
