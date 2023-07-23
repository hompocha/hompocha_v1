import React, {useState} from 'react';
import styles from './RoomCreate.module.css';
import CamFour from '../cam/CamFour';
import axios from 'axios';
import Room from '../Room/Room';
import {Link, useNavigate} from 'react-router-dom';

const RoomCreate = () => {

  const [room_name, setRoomName] = useState<string>("");
  const [idx, setIdx] = useState<string>("");
  const navigate = useNavigate();

  const handleRoomCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/lobby/create`, {
        room_name,
        idx,
      });
      console.log(response.data);
      alert("방 생성 성공");
      // <Link to="/Room" room_name = {room_name}/>
      // navigate(`/Room`);
      navigate('/Room', { state: { roomName: room_name , idx : idx} }); 
    } catch (error) {
        console.error("방 생성 오류:", error);
        alert("방 생성 실패");
    }
  };
  return (
      <div className={styles.container}>
        <div>
          <input type = "text" placeholder="방 제목" value={room_name} onChange={e => setRoomName(e.target.value)}/>
        </div>
        <button type="submit" onClick = {handleRoomCreate}>방 생성</button>
      </div>
    )
}

export default RoomCreate