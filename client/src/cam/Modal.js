import styles from "./Modal.module.css";

function Modal(props) {
  return (
    <div className={styles.modalWrap}>
      <div className={styles.modalInterior}>
        <div className={styles.modalText}>
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
          <p>
            캡처 - "사진 찍어 주세요"
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
