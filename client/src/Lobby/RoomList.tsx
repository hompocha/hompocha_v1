import React, { useState, useEffect, useRef } from "react";
import styles from "./RoomList.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CamTest from "../cam/CamTest";

interface RoomData {
  idx: string;
  room_name: string;
  room_max: number;
  room_state: string;
}

const RoomList = () => {
  const [title, setTitle] = useState<string[]>([""]);
  const [idx, setIdx] = useState("");
  const [peopleNum, setPeopleNum] = useState(0);
  const [room_max, setRoom_Max] = useState<number[]>([]); // 배열로 변경
  const [room_state, setRoom_State] = useState("");
  const navigate = useNavigate();
  const page1Ref = useRef<HTMLDivElement>(null);

  const handleClick = async (idx: string, room_name: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lobby/roomInfo`,
        { room_name, idx }
      );
      console.log(response.data);
      alert("방 입장 정보 보내기 성공");
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
    handleRoomList();
  }, []);

  const handleRoomList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/lobby/roomList`
      );
      console.log(response.data);

      setTitle(response.data.map((room: RoomData) => room.room_name));
      setIdx(response.data.map((idx: RoomData) => idx.idx));
      setRoom_Max(response.data.map((room_max: RoomData) => room_max.room_max));
      setRoom_State(response.data.map((room_state: RoomData) => room_state.room_state));
    } catch (error) {
      console.error("방 정보 출력 오류:", error);
    }
  };


  return (
    <>
      <div ref={page1Ref} className={`${styles.page} ${styles.page1}`}>
        <img src="/RoomPage/menu2.png" alt="Menu 2" key={`menu2`}></img>
      </div>
      <div className={styles.roomListWrap}>
        {title.map((t,index) => (

          <div className = {styles.roomList} key={index}>
            <h4>
              방 제목 : {t}
              현재 참여 인원 : 👤{peopleNum} / {room_max[index]}
            </h4>
            <h4>
              상태 : {room_state}
            </h4>
            <button
            type="submit"
            onClick={() => handleClick(idx[index], t)}
              >
            방 입장
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default RoomList;
