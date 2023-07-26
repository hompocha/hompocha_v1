import React, {Component} from "react";
import UseSpeechRecognition from "../voice/useSpeechRecognition";
import Cam from "./Cam";
import GameCam from "../Games/GameCam";
import styles from "../cam/CamMain.module.css"


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
      }
    });
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
              </div>
              <div className={styles.camAndVoice}>
                <UseSpeechRecognition sendEffectSignal={this.sendEffectSignal}/>
                <Cam
                  user={this.props.user}
                />
              </div>
            </div>
          ) : null
        }


        {/* 에어하키 모드 */}
        {this.state.mode === "airHockey" ? (
          <div>
            <GameCam mode={this.state.mode} user={this.props.user}/>
            <form>
              <input onClick={this.returnToRoom} type="button" value="방으로 이동"/>
            </form>
          </div>
        ) : null}

        {/* 오리 옮기기 모드 */}
        {this.state.mode === "movingDuck" ? (
          <div>
            <GameCam mode={this.state.mode} user={this.props.user}/>
            <form>
              <input onClick={this.returnToRoom} type="button" value="방으로 이동"/>
            </form>
          </div>
        ) : null}
      </div>
    );
  }
}
