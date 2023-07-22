import React, { useState } from "react";
import styles from "./RoomList.module.css";

const RoomList = () => {
    const rooms = ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5"];
    const [currentRoomIdx, setCurrentRoomIdx] = useState(0);

    const handleNextClick = () => {
        if (currentRoomIdx < rooms.length - 1) {
            setCurrentRoomIdx((prevIdx) => (prevIdx + 1) % rooms.length);
        }
    };
    const handlePrevClick = () => {
        if (currentRoomIdx > 0) {
            setCurrentRoomIdx((prevIdx) => (prevIdx - 1) % rooms.length);
        }
    };
    return (
        <div>
            <button onClick={handlePrevClick}>이전</button>
            <ul>
                <div className={styles.container}>
                <li>{rooms[currentRoomIdx]}</li>
                </div>
            </ul>
            <button onClick={handleNextClick}>다음</button>
        </div>
    );
};

export default RoomList;
