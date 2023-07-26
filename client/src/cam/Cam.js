import UserVideoComponent from "./UserVideoComponent";
import styles from "./Cam.module.css";

function Cam(props) {
  // num={this.props.user.getSubscriber().length + 1}
  // publisher={this.props.user.getStreamManager()}
  // subscribers={this.props.user.getSubscriber()}
  const mode = props.user.mode;
  const publisher = props.user.getStreamManager();
  const subscribers = props.user.getSubscriber();
  const members = [publisher, ...subscribers];
  const num = props.user.getSubscriber().length + 1;
  // console.log(members);
  // members.sort((a, b) => {
  //   return a.stream.connection.connectionId < b.stream.connection.connectionId ?
  //       -1 : (a.stream.connection.connectionId > b.stream.connection.connectionId ? 1 : 0) });
  // members.forEach((member) => {
  //   if(member!==undefined){
  //     console.log('member',member.stream.connection.connectionId);
  //   }
  // });
  return (
    <div className={styles.camWrap}>
      <div className={styles.main}>
        <div className={styles.parentDiv}>
          <div className={styles.part1}>
            <UserVideoComponent
              className={styles.userVideo}
              mode={mode}
              streamManager={members[0]}
            />
          </div>
          <div className={styles.part2}>
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
          <div className={styles.part3}>
            {num > 2 ? (
              <UserVideoComponent
                className={styles.userVideo}
                mode={mode}
                streamManager={members[2]}
              />
            ) : null}
          </div>
          <div className={styles.part4}>
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
    </div>
  );
}

export default Cam;
