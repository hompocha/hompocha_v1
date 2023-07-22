import React from 'react';
import styles from './RoomCreate.module.css';

const RoomCreate = () => {

  return (
    <div className={styles.container}>
      <h2 >게임 방 이름</h2>
      <button type="submit">방 생성</button>
    </div>
    )
}

export default RoomCreate