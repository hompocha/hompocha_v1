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

  return (
    <div className={styles.loading}>
      <h2>{text}</h2>
      <h3>Loading...</h3>
      <PacmanLoader color="#36d7b7" />
    </div>
  );
};

export default Loading;
