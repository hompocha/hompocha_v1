import React, { useState } from "react";
import styles from "./RoomCreate.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface NickNameProps{
  nickName:string;
}
const RoomCreate: React.FC<NickNameProps> = ({ nickName }) => {
  const [room_name, setRoomName] = useState<string>("");
  const [maxPeople, setMaxPeople] = useState(2);
  const [idx, setIdx] = useState<string>("");
  const navigate = useNavigate();

  const handleRoomCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lobby/create`,
        { room_name, maxPeople, }
      );
      setIdx(response.data);
      navigate("/Room", { state: { roomName: room_name, idx: idx, maxPeople: maxPeople, nickName:nickName } });
    } catch (error) {
      console.error("방 생성 오류:", error);
    }
  };
  
  const PeopleRadio: React.FC = () => {
    const radioItems = [];
    for (let i = 2; i <= 6; i++) {
      radioItems.push(
        <React.Fragment key={`radio-item-${i}`}>
          <label htmlFor={`${i}`}>{i}</label>
          <input
            type="radio"
            id={`${i}`}
            name="maxPeople"
            value={`${i}`}
            checked={maxPeople === i}
            onChange={(e) => setMaxPeople(Number(e.target.value))}
          />
        </React.Fragment>
      );
    }
    return <>{radioItems}</>;
  };
  return (
      <div >
        <input
          type="text"
          placeholder="방 제목"
          value={room_name}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <div>
          <PeopleRadio/>        
        </div>
        <button type="submit" onClick={handleRoomCreate}>
          방 생성
        </button>
      </div>
  );
};

export default RoomCreate;
