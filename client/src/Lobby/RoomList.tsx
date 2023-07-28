import React, { useState, useEffect } from "react";
import styles from "./RoomList.module.css";
import axios from "axios";
import RoomInfo from "./RoomInfo";
import RoomCreate from "./RoomCreate";
interface RoomData {
  idx: string;
  room_name: string;
}

const RoomList = () => {
  const [title, setTitle] = useState<string[]>([""]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [idx, setIdx] = useState("");
  const [flag, setFlag] = useState<number>(0);
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
  const [currentIdx, setCurrentIdx] = useState("");

  useEffect(() => {
    handleRoomList();
  }, []);

  useEffect(() => {
    if (title.length > 0 && idx.length > 0) {
      setSelectedTitle(title[0]);
      setCurrentIdx(idx[0]);
    }
  }, [title, idx]);

  const handleRoomList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/lobby/roomList`
      );
      console.log(response.data);

      setTitle(response.data.map((room: RoomData) => room.room_name));
      setIdx(response.data.map((idx: RoomData) => idx.idx));
    } catch (error) {
      console.error("방 정보 출력 오류:", error);
    }
  };

  const RoomListOrCreate = () => {
    setFlag((prevFlag) => (prevFlag === 0 ? 1 : 0));
  };

  const handleNextClick = () => {
    if (currentRoomIdx < title.length - 1) {
      setSelectedTitle(title[currentRoomIdx + 1]);
      setCurrentRoomIdx((prevIdx) => prevIdx + 1);
      setCurrentIdx(idx[currentRoomIdx + 1]);
    }
  };
  const handlePrevClick = () => {
    if (currentRoomIdx > 0) {
      setSelectedTitle(title[currentRoomIdx - 1]);
      setCurrentRoomIdx((prevIdx) => prevIdx - 1);
      setCurrentIdx(idx[currentRoomIdx - 1]);
    }
  };
  return (
    <div className={styles.roomListWrap}>
      <div className={styles.leftRoomInfo}>
        <button onClick={handlePrevClick}>이전</button>
        <div className={styles.container}>
          <span key={currentRoomIdx}>방 제목 : {title[currentRoomIdx]}</span>
        </div>
        <button onClick={handleNextClick}>다음</button>
      </div>
      {flag === 0 && (
        <div className={styles.roomDetail}>
          <RoomInfo selectedTitle={selectedTitle} currentIdx={currentIdx} />
          <button type="submit" onClick={RoomListOrCreate}>
            방 생성
          </button>
        </div>
      )}
      <div>
        {flag !== 0 && (
          <div className={styles.roomCreate}>
            <RoomCreate />
            <button type="submit" onClick={RoomListOrCreate}>
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
