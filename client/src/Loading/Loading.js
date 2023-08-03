import React from "react";
import styles from "./Loading.module.css";
// import {PacmanLoader} from "react-spinners";
import { PacmanLoader } from "react-spinners";
const Loading = () => {
  return (
    <div className={styles.loading}>
      <h3>Loading...</h3>
      <PacmanLoader color="#36d7b7" />
    </div>
  );
};

export default Loading;
