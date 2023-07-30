import React, { useState, useEffect, useRef } from "react";
import styles from "./RoomList.module.css";
import axios from "axios";
import RoomInfo from "./RoomInfo";
import RoomCreate from "./RoomCreate";
import Room from "../Room/Room";

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
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

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
    // 길이는 배열의 크기를 의미하므로 (길이 - 1)을 통해 마지막 인덱스를 얻습니다.
    if (currentRoomIdx < title.length - 1) { // 현재 인덱스가 마지막 인덱스보다 작지 않게 확인합니다.
      const roomIdx = currentRoomIdx + 1; // 현재인덱스에 1을 더하여 다음 방 인덱스를 구합니다.
      setSelectedTitle(title[roomIdx]); // 계산된 인덱스(다음 인덱스)로 선택된 제목을 변경합니다.
      setCurrentRoomIdx((prevIdx) => prevIdx + 1); // 현재 방 인덱스를 업데이트하여 상태를 변경합니다.
      setCurrentIdx(idx[roomIdx]); // 해당 방의 새로운 idx 값을 저장하는 변수를 업데이트합니다.
      
      // 다음 코드의 오류를 방지하기 위해 page1Ref.current와 page2Ref.current가 null 인지 확인
      if (page1Ref.current && page2Ref.current) {
        // 페이지1의 첫 번째 자식 요소의 src 속성(이미지 파일)을 계산된 경로로 변경합니다.
        // roomIdx에 따라 menu1.png 또는 menu2.png 중 하나를 가져옵니다.
        page1Ref.current.children[roomIdx].setAttribute("src", `/RoomPage/menu2.png`);
        
        // 페이지1의 3D 회전 애니메이션을 설정하여 페이지가 뒤집어지도록 합니다.
        page1Ref.current.style.transform = "perspective(1000px) rotateY(-180deg)";
        
        // 페이지1을 페이지2 하위로 배치하여 페이지 애니메이션 후 페이지1이 페이지2 아래에 렌더링 되도록 합니다.
        page1Ref.current.style.zIndex = "0";
        
        // 페이지2를 페이지1 상위로 배치하여 페이지 애니메이션 후 페이지2가 페이지1 위에 렌더링 되도록 합니다.
        page2Ref.current.style.zIndex = "1";
      
      }
    }
  };
  const handlePrevClick = () => {
    if (currentRoomIdx > 0) {
      const roomIdx = currentRoomIdx - 1;
      setSelectedTitle(title[roomIdx]);
      setCurrentRoomIdx((prevIdx) => prevIdx - 1);
      setCurrentIdx(idx[roomIdx]);
      
      if (page1Ref.current && page2Ref.current) {
        page1Ref.current.children[0].setAttribute("src", `/Menu/menu${roomIdx % 2 + 1}.png`);
        page1Ref.current.style.transform = "perspective(1000px)";
        page1Ref.current.style.zIndex = "1";
        page2Ref.current.style.zIndex = "0";
      }
    }
  };
  return (
    <>
      <div className={styles.book}>
      <div ref={page2Ref} className={`${styles.page} ${styles.page2}`}>
        <img src="/RoomPage/menu1.png" alt="Menu 1" key={`menu1-${currentRoomIdx}`}></img>
      </div>
      </div>
      <div className={styles.roomListWrap}>
        <div className={styles.leftRoomInfo}>
          <button onClick={handlePrevClick}>이전</button>
          <div className={styles.container}>
            <span key={currentRoomIdx}>방 제목 : {title[currentRoomIdx]}</span>
          </div>
          <button onClick={handleNextClick}>다음</button>
        </div>
        <div className={styles.rightRoomInfo}>
        <div ref={page1Ref} className={`${styles.page} ${styles.page1}`}>
          <img src="/RoomPage/menu2.png" alt="Menu 2" key={`menu2-${currentRoomIdx}`}></img>
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
        </div>
      </div>
    </>
  );
};

export default RoomList;
