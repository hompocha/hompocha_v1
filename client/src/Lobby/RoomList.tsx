import React, { useState, useEffect, useRef } from "react";
import styles from "./RoomList.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CamTest from "../cam/CamTest";

interface RoomData {
  idx: string;
  room_name: string;
  room_max: number;
  room_status: string;
  peopleNum: number;
}

interface NickNameProps {
  nickName: string;
}
const RoomList: React.FC<NickNameProps> = ({ nickName }) => {
  const [title, setTitle] = useState<string[]>([""]);
  const [idx, setIdx] = useState("");
  const [peopleNum, setPeopleNum] = useState<number[]>([]);
  const [room_max, setRoom_Max] = useState<number[]>([]); // 배열로 변경
  const [room_status, setRoom_Status] = useState<string[]>([""]);
  const navigate = useNavigate();
  const page1Ref = useRef<HTMLDivElement>(null);

  const handleClick = async (
    idx: string,
    room_name: string,
    peopleNum: number,
    room_max: number,
    room_status: string
  ) => {
    if (peopleNum === room_max) {
      alert("최대 인원 초과!!");
      return;
    }
    if (room_status === "게임 중") {
      alert("게임중입니다!!");
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lobby/roomInfo`,
        { room_name, idx },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 요청 헤더에 토큰을 포함하여 서버에 전송
          },
        }
      );
      console.log(response.data);
      navigate("/room", {
        state: { roomName: room_name, idx: idx, nickName: nickName },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleRoomList();
    const interval = setInterval(handleRoomList, 1500); // 1분(60,000ms) 간격으로 호출
    return () => clearInterval(interval);
  }, []);

  const handleRoomList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/lobby/roomList`
      );
      console.log(idx);
      setTitle(response.data.map((room: RoomData) => room.room_name));
      setIdx(response.data.map((idx: RoomData) => idx.idx));
      setPeopleNum(
        response.data.map((peopleNum: RoomData) => peopleNum.peopleNum)
      );
      setRoom_Max(response.data.map((room_max: RoomData) => room_max.room_max));
      setRoom_Status(
        response.data.map((room_status: RoomData) => room_status.room_status)
      );
    } catch (error) {
      console.error("방 정보 출력 오류:", error);
    }
  };

  return (
    <>
      <div ref={page1Ref} className={styles.roomListContainer}>
        <div className={styles.roomListWrap}>
          <div className={styles.roomInfo}>
            <div className={styles.roomTitle}>방 제목</div>
            <div className={styles.roomNumOfUsers}>현재 참여 인원</div>
            <div className={styles.roomState}>방 상태</div>
            <div className={styles.btnSpace}></div>
          </div>
          {title.map((t, index) => (
            <div className={styles.roomList} key={index}>
              <div className={styles.roomName}>{t}</div>
              <div className={styles.roomPeople}>
                👤 {peopleNum[index]} / {room_max[index]}
              </div>
              <div className={styles.roomStatus}>{room_status[index]}</div>
              <button
                type="submit"
                className={styles.roomInButton}
                onClick={() =>
                  handleClick(
                    idx[index],
                    t,
                    peopleNum[index],
                    room_max[index],
                    room_status[index]
                  )
                }
              >
                방 입장
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RoomList;
