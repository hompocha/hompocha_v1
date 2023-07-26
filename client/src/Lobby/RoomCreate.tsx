import React, { useState } from "react";
import styles from "./RoomCreate.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RoomCreate = () => {
  const [room_name, setRoomName] = useState<string>("");
  const [idx, setIdx] = useState<string>("");
  const navigate = useNavigate();

  const handleRoomCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lobby/create`,
        {
          room_name,
          idx,
        }
      );
      console.log(response.data);
      alert("방 생성 성공");
      navigate("/Room", { state: { roomName: room_name, idx: idx } });
    } catch (error) {
      console.error("방 생성 오류:", error);
      alert("방 생성 실패");
    }
  };
  return (
    <div className={styles.roomCreateWrap}>
      <input
        type="text"
        placeholder="방 제목"
        value={room_name}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button type="submit" onClick={handleRoomCreate}>
        방 생성
      </button>
    </div>
  );
};

export default RoomCreate;
