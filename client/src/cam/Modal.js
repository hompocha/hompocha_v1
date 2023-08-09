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
          {/*<span className={styles.textHeader}>[테마 변경]</span>*/}
          {/*<p className={styles.text}>*/}
          {/*  "테마 바꿔 주세요"*/}
          {/*</p>*/}
          {/* <p className={styles.text}>
            다양한 공간에서 모임을 즐길 수 있습니다.
          </p> */}
          <br />
          <span className={styles.textHeader}>[게임 실행]</span>
          <p >
            "발음 게임이요", "소맥 게임이요", "피하기 게임이요"
          </p>
          <br />
          <span className={styles.textHeader}>[다양한 명령어]</span>
          <p>
            테마변경   - "테마 바꿔주세요"
          </p>
          <p>
            건배   - "우리 한잔할까?"
          </p>
          <p >
            키워드 - "뭐 먹을까?"      "벚꽃"
          </p>
          <p >
            룰렛 - "돌려주세요"
          </p>
          <p>
            채팅창 - "채팅창 보여줘" "채팅창 닫아줘"
          </p>
          <p className={styles.text}>
            이 외에도 숨은 명령어를 찾아보세요!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Modal;
