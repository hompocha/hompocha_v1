import UserVideoComponent from "./UserVideoComponent";
import styles from "./Cam.module.css";

function Cam(props) {

// num={this.props.user.getSubscriber().length + 1}
// publisher={this.props.user.getStreamManager()}
// subscribers={this.props.user.getSubscriber()}
  const mode = props.user.mode;
  const publisher = props.user.getStreamManager();
  const subscribers = props.user.getSubscriber();
  const num = props.user.getSubscriber().length+1;
  const members = [publisher, ...subscribers];
  console.log(members);
  // members.sort((a, b) => {
  //   return a.stream.connection.connectionId < b.stream.connection.connectionId ?
  //       -1 : (a.stream.connection.connectionId > b.stream.connection.connectionId ? 1 : 0) });
  // members.forEach((member) => {
  //   if(member!==undefined){
  //     console.log('member',member.stream.connection.connectionId);
  //   }
  // });
  return (
    <>
      <div className={styles.main}>
        <div className={styles.parentDiv}>
          <div
            className={styles.part1}
            style={{ weight: "450px", height: "450px" }}
          >
            <UserVideoComponent
              className={styles.userVideo}
              mode={mode}
              streamManager={members[0]}
            />
          </div>
          <div
            className={styles.part2}
            style={{ weight: "450px", height: "450px" }}
          >
            {num > 1 ? (
              <UserVideoComponent
                className={styles.userVideo}
                mode={mode}
                streamManager={members[1]}
              />
            ) : null}
          </div>
        </div>
        <div className={styles.parentDiv}>
          <div
            className={styles.part3}
            style={{ weight: "450px", height: "450px" }}
          >
            {num > 2 ? (
              <UserVideoComponent
                className={styles.userVideo}
                mode={mode}
                streamManager={members[2]}
              />
            ) : null}
          </div>
          <div
            className={styles.part4}
            style={{ weight: "450px", height: "450px" }}
          >
            {num > 3 ? (
              <UserVideoComponent
                className={styles.userVideo}
                mode={mode}
                streamManager={members[3]}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Cam;
