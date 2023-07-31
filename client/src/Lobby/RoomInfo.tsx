import React, { useState, useEffect } from "react";
import styles from "./RoomInfo.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface RoomInfoProps {
  selectedTitle: string;
  currentIdx: string;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ selectedTitle, currentIdx}) => {
  const [peopleNum, setPeopleNum] = useState(0);
  const [mode, setMode] = useState("");
  const navigate = useNavigate();
  const room_name = selectedTitle;
  const idx = currentIdx;

  const handleClick = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lobby/roomInfo`,
        { room_name, idx, }
      );
      console.log(response.data);
      navigate("/Room", { state: { roomName: room_name, idx: idx } });
    } catch (error) {
      console.error(error);
      alert("방 입장 정보 실패");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        if (jwtToken) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/room/roomInfo`
        );
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);


  return (
    <div className={styles.roomInfoWrap}>
      <h2>방 제목 : {room_name}</h2>
      <h3>
        현재 참여 인원 : 👤 {peopleNum}
      </h3>
      <h3>
        모드 : {mode}
      </h3>
      <button type="submit" onClick={handleClick}>
        방 입장
      </button>
    </div>
  );
};

export default RoomInfo;
