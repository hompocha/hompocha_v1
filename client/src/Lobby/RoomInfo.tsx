import React, { useState, useEffect } from "react";
import styles from "./RoomInfo.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface RoomInfoProps {
  selectedTitle: string;
  currentIdx: string;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ selectedTitle, currentIdx}) => {
  const [inpeople, setInPeople] = useState("");
  const [maxpeople, setMaxPeople] = useState("");
  const navigate = useNavigate();
  const room_name = selectedTitle;
  const idx = currentIdx;
  console.log(idx);

  const handleClick = async () => {
    try {
      const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/lobby/roomInfo`,
          {
            room_name,
            idx,
          }
      );
      console.log(response.data);
      alert("방 입장 정보 보내기 성공");
      navigate("/Room", { state: { roomName: room_name, idx: idx } });
    } catch (error) {
      console.error(error);
      alert("방 입장 정보 실패");
    }
  };


  return (
      <div className={styles.roomInfoWrap}>
        <h2>방 제목 : {room_name}</h2>
        <h3>
          현재 참여 인원 : 👤 {inpeople}/{maxpeople}
        </h3>
        <button type="submit" onClick={handleClick}>
          방 입장
        </button>
      </div>
  );
};

export default RoomInfo;