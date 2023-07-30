import React, { useState } from "react";
import styles from "./RoomCreate.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RoomCreate = () => {
  const [room_name, setRoomName] = useState<string>("");
  const [maxPeople, setMaxPeople] = useState(2);
  const [idx, setIdx] = useState<string>("");
  const navigate = useNavigate();

  const handleRoomCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lobby/create`,
        {
          room_name,
          maxPeople,
        }
      );
      setIdx(response.data);
      alert("방 생성 성공");
      navigate("/Room", { state: { roomName: room_name, idx: idx, maxPeople: maxPeople } });
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
      <div>
      <label htmlFor="2">2</label>
      <input
        type="radio"
        id="2"
        name="maxPeople"
        value="2"
        checked={maxPeople === 2}
        onChange={(e) => setMaxPeople(Number(e.target.value))}
      />

      <label htmlFor="3">3</label>
      <input
        type="radio"
        id="3"
        name="maxPeople"
        value="3"
        checked={maxPeople === 3}
        onChange={(e) => setMaxPeople(Number(e.target.value))}
      />

      <label htmlFor="4">4</label>
      <input
        type="radio"
        id="4"
        name="maxPeople"
        value="4"
        checked={maxPeople === 4}
        onChange={(e) => setMaxPeople(Number(e.target.value))}
      />

      <label htmlFor="5">5</label>
      <input
        type="radio"
        id="5"
        name="maxPeople"
        value="5"
        checked={maxPeople === 5}
        onChange={(e) => setMaxPeople(Number(e.target.value))}
      />

      <label htmlFor="6">6</label>
      <input
        type="radio"
        id="6"
        name="maxPeople"
        value="6"
        checked={maxPeople === 6}
        onChange={(e) => setMaxPeople(Number(e.target.value))}
      />
      </div>
      <button type="submit" onClick={handleRoomCreate}>
        방 생성
      </button>
    </div>
  );
};

export default RoomCreate;
