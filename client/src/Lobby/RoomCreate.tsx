import React, { useState } from "react";
import styles from "./RoomCreate.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface NickNameProps {
  nickName: string;
}
const RoomCreate: React.FC<NickNameProps> = ({ nickName }) => {
  const [room_name, setRoomName] = useState<string>("");
  const [maxPeople, setMaxPeople] = useState(2);
  const [idx, setIdx] = useState<string>("");
  const navigate = useNavigate();

  const handleRoomCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (room_name.length > 15) {
      alert("방 제목을 15글자 이하로 해주세요");
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lobby/create`,
        { room_name, maxPeople },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 요청 헤더에 토큰을 포함하여 서버에 전송
          },
        }
      );
      setIdx(response.data);
      navigate("/Room", {
        state: {
          roomName: room_name,
          idx: response.data,
          maxPeople: maxPeople,
          nickName: nickName,
        },
      });
    } catch (error) {
      console.error("방 생성 오류:", error);
    }
  };

  const PeopleRadio: React.FC = () => {
    const radioItems = [];
    for (let i = 2; i <= 6; i++) {
      radioItems.push(
        <React.Fragment key={`radio-item-${i}`}>
          <div>
            <label htmlFor={`${i}`}>{i}</label>
            <input
              type="radio"
              id={`${i}`}
              name="maxPeople"
              value={`${i}`}
              checked={maxPeople === i}
              style={{ width: "25px", height: "25px" }}
              onChange={(e) => setMaxPeople(Number(e.target.value))}
            />
          </div>
        </React.Fragment>
      );
    }
    return <>{radioItems}</>;
  };
  return (
    <div className={styles.roomCreateContainer}>
      <span className={styles.roomCreateTag}>방 제목</span>
      <input
        className={styles.roomCreateInput}
        type="text"
        placeholder="방 제목을 입력해주세요"
        value={room_name}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <br />
      <span className={styles.roomCreateTag}>인원 선택</span>
      <div className={styles.roomCreateNum}>
        <PeopleRadio />
      </div>
      <br />
      <button
        className={styles.roomCreateButton}
        type="submit"
        onClick={handleRoomCreate}
      >
        방 생성
      </button>
    </div>
  );
};

export default RoomCreate;
