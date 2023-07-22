import React, {useState} from 'react';
import styles from './RoomCreate.module.css';
import axios from 'axios';

const RoomCreate = () => {
  const [room_name, setRoomName] = useState<string>("");
  const [roomCount, setRoomCount] = useState<number>(0);
  const handleRoomCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/rooms/create`, {
        room_name,
      });
      console.log(response.data);

      alert("방 생성 성공");
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