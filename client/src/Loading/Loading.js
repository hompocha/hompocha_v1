import React from "react";
import styles from "./Loading.module.css";
import { PacmanLoader } from "react-spinners";
const Loading = (props) => {
  let text;
  if(props.mode === "speechGame")
    text= "발음 게임 실행중.."
  else if(props.mode === "somaek")
    text="소맥 게임 실행중.."
  else if(props.mode === "avoidGame")
    text="피하기 게임 실행중.."
  else
    text="메인화면으로 이동중..."

  return (
    <div className={styles.loading}>
      <span style={{ color: 'white', fontSize: '40px' }}>{text}</span>
      <span style={{ color: 'whitesmoke', fontSize: '40px' }}>Loading...</span>
      <img src="/Loading/LoadingSoju-unscreen.gif" alt="sojuLoading" style={{ width: '450px', height: '450px' }} />
      {/*<PacmanLoader color="#36d7b7" />*/}
    </div>
  );
};

export default Loading;
