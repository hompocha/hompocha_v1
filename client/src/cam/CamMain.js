import React, { Component } from "react";
import UseSpeechRecognition from "../voice/useSpeechRecognition";
import Cam from "./Cam";
import GameCam from "../Games/GameCam";

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

    /* 게임 모드 전환 신호 */
    sendGameTypeSignal(string) {
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
                {/* Main Room */}
                {this.state.mode === undefined ? (
                    <>
                        <div id="session">
                            <div id="session-header">
                                <h1 id="session-title">"mysession id 따와야됨"</h1>
                                <h2>{this.props.user.subscribers.length + 1}</h2>
                                {/*<input
                                  type="button"
                                  id="buttonLeaveSession"
                                  onClick={this.leaveSession}
                                  value="Leave session"
                                />
                                <input
                                  type="button"
                                  id="buttonSwitchCamera"
                                  onClick={this.switchCamera}
                                  value="Switch Camera"
                                />*/}
                                <input onClick={() => this.sendGameTypeSignal("airHockey")} type="button" value="에어하키" />
                                <input onClick={() => this.sendGameTypeSignal("movingDuck")} type="button" value="오리옮기기" />
                                <UseSpeechRecognition sendSignal={this.sendEffectSignal} />
                            </div>

                            <Cam
                                user={this.props.user}
                                // num={this.props.user.getSubscriber().length + 1}
                                // publisher={this.props.user.getStreamManager()}
                                // subscribers={this.props.user.getSubscriber()}
                            />
                        </div>
                    </>
                ) : null}

                {/* 에어하키 모드 */}
                {this.state.mode === "airHockey" ? (
                    <div>
                        <GameCam mode={this.state.mode} user={this.props.user} />
                        <form>
                            <input onClick={this.returnToRoom} type="button" value="방으로 이동" />
                        </form>
                    </div>
                ) : null}

                {/* 오리 옮기기 모드 */}
                {this.state.mode === "movingDuck" ? (
                    <div>
                        <GameCam mode={this.state.mode} user={this.props.user} />
                        <form>
                            <input onClick={this.returnToRoom} type="button" value="방으로 이동" />
                        </form>
                    </div>
                ) : null}
            </div>
        );
    }
}
