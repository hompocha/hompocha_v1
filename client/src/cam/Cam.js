import CamSlice from "./CamSlice";
import UserVideoComponent from "./UserVideoComponent";
import styles from "./Cam.module.css";

function Cam({ num, publisher, subscribers }) {
  console.log(`subscribers : ${subscribers}`);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.parentDiv}>
          <div className={styles.part1} style={{weight : "450px", height : "450px"}}>
            <UserVideoComponent
              className={styles.userVideo}
              streamManager={publisher}
            />
          </div>
          <div className={styles.part2} style={{weight : "450px", height : "450px"}}>
            {num > 1 ? (
              <UserVideoComponent streamManager={subscribers[0]} />
            ) : null}
          </div>
        </div>
        <div className={styles.parentDiv}>
          <div className={styles.part3} style={{weight : "450px", height : "450px"}}>
            {num > 2 ? (
              <UserVideoComponent streamManager={subscribers[1]} />
            ) : null}
          </div>
          <div className={styles.part4} style={{weight : "450px", height : "450px"}}>
            {num > 3 ? (
              <UserVideoComponent streamManager={subscribers[2]} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Cam;
