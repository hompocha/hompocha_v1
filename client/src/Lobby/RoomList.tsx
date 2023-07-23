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
        
        // setSelectedTitle(title[0]);
        // setCurrentIdx(idx[0]);
        // console.log(selectedTitle, currentIdx);
      
      // alert("방 정보 출력 성공");
    } catch (error) {
      console.error("방 정보 출력 오류:", error);
      // alert("방 정보 출력 실패");
    }
  };

  const RoomListOrCreate = () => {
    setFlag((prevFlag) => (prevFlag === 0 ? 1 : 0));
  }

  const handleNextClick = () => {
    if (currentRoomIdx < title.length - 1) {
      setSelectedTitle(title[currentRoomIdx + 1]);
      setCurrentRoomIdx((prevIdx) => prevIdx + 1);
      setCurrentIdx((idx[currentRoomIdx+1]));
    }
  };
  const handlePrevClick = () => {
    if (currentRoomIdx > 0) {
      setSelectedTitle(title[currentRoomIdx - 1]);
      setCurrentRoomIdx((prevIdx) => prevIdx - 1);
      setCurrentIdx((idx[currentRoomIdx - 1]));
    }
  };
  return (
    <div>

      <button onClick={handlePrevClick}>이전</button>
      <div className={styles.container}>
        <ul>
          <li key={currentRoomIdx}>{title[currentRoomIdx]}</li>
        </ul>
      </div>
      <div style={{position : "fixed", marginLeft : "30%" , marginTop : "0%"}}>
        {flag === 0 && <RoomInfo selectedTitle={selectedTitle} currentIdx= {currentIdx}/>}
        {flag !== 0 && (<RoomCreate />)}
      </div>
      <div>
            {flag === 0 && <button type='submit' onClick={RoomListOrCreate}> 방 생성</button>}
            {flag !== 0 && <button type='submit' onClick={RoomListOrCreate}> 닫기</button>}
          </div>
      <button onClick={handleNextClick}>다음</button>
    </div>
  );
};

export default RoomList;