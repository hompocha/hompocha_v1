import UseSpeechRecognition from "../voice/useSpeechRecognition";
import Cam from "./Cam";
import React, { Component } from "react";
import GameCam from "../Games/GameCam";
import UserModel from "../models/user-model";
import styles from "./CamMain.module.css";

export default class CamMain extends Component {
  constructor(props) {
    super(props);
    this.enterAirHockey = this.enterAirHockey.bind(this);
    this.enterMovingDuck = this.enterMovingDuck.bind(this);
    this.sendEffectSignal = this.sendEffectSignal.bind(this);
    this.sendEnterSignal = this.sendEnterSignal.bind(this);
    this.state = {
      mode: undefined,
    };
  }
  componentDidMount() {
    this.props.user
      .getStreamManager()
      .stream.session.on("signal:gameRoom", (event) => {
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
      (prevState) => ({
        mode: "airHockey",
      }),
      () => {
        this.props.onModeChange("airHockey");
      }
    );
  };

  enterMovingDuck = () => {
    this.setState(
      (prevState) => ({
        mode: "movingDuck",
      }),
      () => {
        this.props.onModeChange("movingDuck");
      }
    );
  };
  // enterMovingDuck(e) {
  //     // e.preventDefault();
  //     this.setState({
  //         mode: "movingDuck",
  //     });
  //     this.props.user.set
  //     const localUser = Object.assign(new UserModel,
  //     this.props.setUserStream()
  // }
  sendEffectSignal(string) {
    if (this.props.user.getStreamManager().session) {
      this.props.user
        .getStreamManager()
        .session.signal({
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

  sendEnterSignal(string) {
    if (this.props.user.getStreamManager().session) {
      this.props.user
        .getStreamManager()
        .session.signal({
          data: string,
          to: [],
          type: "gameRoom",
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
    // console.log("cammain rendered##########");
    // console.log(this.props);
    // console.log(this.state.mode);
    return (
      <>
        {
          /* Main Room */
          this.state.mode === undefined ? (
            <div id="session" className={styles.camMainWrap}>
              <div id="session-header" className={styles.camMainHeader}>
                <h1 id="session-title">"mysession id 따와야됨" </h1>
                <h2>{this.props.user.subscribers.length + 1}명 참여중</h2>
                <input
                  onClick={() => this.sendEnterSignal("airHockey")}
                  type="button"
                  value="에어하키"
                />
                <input
                  onClick={() => this.sendEnterSignal("movingDuck")}
                  type="button"
                  value="오리옮기기"
                />
              </div>
              <div className={styles.camAndVoice}>
                <UseSpeechRecognition sendSignal={this.sendEffectSignal} />
                <Cam
                  user={this.props.user}
                  // num={this.props.user.getSubscriber().length + 1}
                  // publisher={this.props.user.getStreamManager()}
                  // subscribers={this.props.user.getSubscriber()}
                />
              </div>
            </div>
          ) : null
        }

        {
          /* 에어하키 구현 */
          this.state.mode === "airHockey" ? (
            <div>
              <GameCam
                // state={this.state}
                mode={this.state.mode}
                user={this.props.user}
              />
              <form>
                <input
                  onClick={this.returnToRoom}
                  type="button"
                  value="방으로 이동"
                />
              </form>
            </div>
          ) : null
        }

        {
          /* 오리 옮기기 구현 */
          this.state.mode === "movingDuck" ? (
            <div>
              <GameCam
                // state={this.state}
                mode={this.state.mode}
                user={this.props.user}
              />
              <form>
                <input
                  onClick={this.returnToRoom}
                  type="button"
                  value="방으로 이동"
                />
              </form>
            </div>
          ) : null
        }
      </>
    );
  }
}
