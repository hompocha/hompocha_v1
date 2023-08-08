import { useState } from "react";
import styles from "./Modal.module.css";

function Modal(props) {
  return (
    <div className={styles.modalWrap}>
      <div className={styles.modalInterior}>
        {/* <input
          className={styles.modalClose}
          type="button"
          onClick={() => props.setModalOpen(false)}
          value="❌"
        /> */}
        <div className={styles.modalText}>
          {/* <p className={styles.textHeader0}>
            홈술포차는 음성인식을 통해 키보드와 마우스 사용을 최소화하여,
            유저분들이 자유롭게 서비스를 즐기도록 지원하고 있습니다.
          </p> */}
          <span className={styles.textHeader}>테마 변경</span>
          <p className={styles.text}>
            "테마 바꿔 주세요" 키워드를 통해 다양한 테마를 제공합니다.
          </p>
          {/* <p className={styles.text}>
            다양한 공간에서 모임을 즐길 수 있습니다.
          </p> */}
          <br />
          <span className={styles.textHeader}>게임 실행</span>
          <p className={styles.text}>
            "발음 게임이요", "소맥 게임이요", "피하기 게임이요" 키워드를 통해 게임을 시작할
            수 있습니다.
          </p>
          <br />
          <span className={styles.textHeader}>키워드 이펙트</span>
          <p className={styles.text}>
            "우리 한잔할까?" 키워드를 통해 건배 기능을 켤 수 있습니다.
          </p>
          <p className={styles.text}>
            "뭐 먹을까?", "고양이" 등의 키워드를 통해 다양한 효과를 볼 수
            있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Modal;
