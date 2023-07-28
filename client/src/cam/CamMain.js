import React, {Component} from "react";
import UseSpeechRecognition from "../voice/useSpeechRecognition";
import CamTest from "./CamTest";
import GameCam from "../Games/GameCam";
import styles from "../cam/CamMain.module.css"
import SpeechGame from "../Games/speechgame/SpeechGame";


export default class CamMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: undefined,
    };

  }

  componentDidMount() {
    this.props.user.getStreamManager().stream.session.on("signal:gameType", (event) => {
      const data = event.data;
      if (data === "airHockey") {
        this.enterAirHockey();
      } else if (data === "movingDuck") {
        this.enterMovingDuck();
      }else if (data === "speechGame") {
        this.enterSpeech();
      }
      /* data 가 undefined 일 경우 방으로 돌아감 */
      else {
        this.enterMainRoom();
      }
    });
  }
  enterMainRoom = () => {
    this.setState(
      {
        mode: undefined,
      },
      () => {
        this.props.onModeChange(undefined);
      }
    );
  }
  enterAirHockey = () => {
    this.setState(
      {
        mode: "airHockey",
      },
      () => {
        this.props.onModeChange("airHockey");
      }
    );
  };

  enterMovingDuck = () => {
    this.setState(
      {
        mode: "movingDuck",
      },
      () => {
        this.props.onModeChange("movingDuck");
      }
    );
  };
  enterSpeech= ()  => {
    this.setState(prevState => ({
      mode: "speechGame",
    }), () => {
      this.props.onModeChange("speechGame");
    });
  };

  sendEffectSignal = (string) => {
    if (this.props.user.getStreamManager().session) {
      this.props.user.getStreamManager().session.signal({
        data: string,
        to: [],
        type: "effect",
      })
        .then(() => {
          console.log("Message successfully sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }


  /* 게임 모드 전환 신호 */
  sendGameTypeSignal = (string) => {
    if (this.props.user.getStreamManager().session) {
      this.props.user.getStreamManager().session
        .signal({
          data: string,
          to: [],
          type: "gameType",
        })
        .then(() => {
          console.log("Message successfully sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  /*======================================================*/
  /*================== Host로 결정 해버리기 ==================*/
  /*======================================================*/
  chooseHost() {
    const members = [];
    this.props.user.subscribers.forEach((subscriber) => {
      members.push(subscriber.stream.connection.connectionId);
    });
    members.push(this.props.user.streamManager.stream.connection.connectionId);
    const sortedMembers = [...members].sort();
    // const test = members[0].stream.connection.connectionId; // TODO 이거 수정해서 넘기는걸로 코드 수정해야
    console.log("Host", sortedMembers[0]);
    console.log("List", members);
    console.log("sortedList :",sortedMembers);
    return sortedMembers[0]
  }
  /*======================================================*/
  /*======================================================*/

  ReturnLobby = () => {

  }
  render() {
    console.log("CamMain rendered");
    return (
      <div>
        {
          /* Main Room */
          this.state.mode === undefined ? (
            <div id="session" className={styles.camMainWrap}>
              <div id="session-header" className={styles.camMainHeader}>
                <h1 id="session-title">{this.props.roomName} </h1>
                <h2>{this.props.user.subscribers.length + 1}명 참여중</h2>
                <input
                  onClick={() => this.sendGameTypeSignal("airHockey")}
                  type="button"
                  value="에어하키"
                />
                <input
                  onClick={() => this.sendGameTypeSignal("movingDuck")}
                  type="button"
                  value="오리옮기기"
                />
                <input
                  onClick={() => this.sendGameTypeSignal("speechGame")}
                  type="button"
                  value="발음게임"
                />

                <form className={styles.ReturnRoom}>
                  <input
                      onClick={this.ReturnLobby}
                      type="button"
                      value="로비로 이동"
                    />
                </form>
              </div>

              <div className={styles.camAndVoice}>
                <UseSpeechRecognition sendEffectSignal={this.sendEffectSignal}/>
                <CamTest
                  user={this.props.user}
                />
              </div>
            </div>
          ) : null
        }


        {/* 에어하키 모드 */}
        {this.state.mode === "airHockey" ? (
          <div>
            <GameCam mode={this.state.mode} user={this.props.user} sessionConnected={this.props.sessionConnected}/>
            <form className={styles.ReturnRoom}>
              <input onClick={() => this.sendGameTypeSignal(undefined)} type="button" value="방으로 이동"/>
            </form>
          </div>
        ) : null}

        {/* 오리 옮기기 모드 */}
        {this.state.mode === "movingDuck" ? (
          <div>
            <GameCam mode={this.state.mode} user={this.props.user} sessionConnected={this.props.sessionConnected}/>
            <form className={styles.ReturnRoom}>
              <input onClick={() => this.sendGameTypeSignal(undefined)} type="button" value="방으로 이동"/>
            </form>
          </div>
        ) : null}
        {
          /* 발음 게임 */
          this.state.mode === "speechGame" ? (
            <div>
              <SpeechGame selectID ={this.chooseHost()} user ={this.props.user}/>
              <form className={styles.ReturnRoom}>
                <input onClick={() => this.sendGameTypeSignal(undefined)} type="button" value="방으로 이동"/>
              </form>
            </div>
          ) : null
        }
      </div>
    );
  }
}
