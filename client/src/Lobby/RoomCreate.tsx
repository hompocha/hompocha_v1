import React from 'react';
import styles from './RoomCreate.module.css';

const RoomCreate = () => {

  return (
    <div className={styles.position}>
      <div className={styles.container}>
          <h2 className={styles.title}>게임 방 이름</h2>
          <div className={styles.roomIn}>
              <button type="submit">방 생성</button>

          </div>
      </div>
  </div>
    )
}

export default RoomCreate