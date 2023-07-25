import UseSpeechRecognition from "../voice/useSpeechRecognition";
import Cam from "./Cam";
import React, {Component} from "react";
import GameCam from "../Games/GameCam";

export default class CamMain extends Component{
    constructor(props){
        super(props);
        this.enterAirHockey = this.enterAirHockey.bind(this);
        this.enterMovingDuck = this.enterMovingDuck.bind(this);
        this.sendEffectSignal = this.sendEffectSignal.bind(this);
    }
    enterAirHockey(e) {
        // e.preventDefault();
        // this.setState({
        //     mode: "airHockey",
        // });
        this.props.user.mode = "airHockey";
    }
    enterMovingDuck(e) {
        // e.preventDefault();
        // this.setState({
        //     mode: "movingDuck",
        // });
        this.props.user.mode = "movingDuck";
    }
    sendEffectSignal(string) {
        if (this.props.user.getStreamManager().session) {
            this.props.user.getStreamManager().session
                .signal({
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

    render(){
        return(
            <div>
                {   /* Main Room */
                    this.props.user.mode === undefined ? (
                        <>

                        <div id="session">
                            <div id="session-header">
                                <h1 id="session-title">"mysession id 따와야됨"</h1>
                                <h2>{this.props.user.subscribers.length + 1}</h2>
                                {/*<input*/}
                                {/*    type="button"*/}
                                {/*    id="buttonLeaveSession"*/}
                                {/*    onClick={this.leaveSession}*/}
                                {/*    value="Leave session"*/}
                                {/*/>*/}
                                {/*<input*/}
                                {/*    type="button"*/}
                                {/*    id="buttonSwitchCamera"*/}
                                {/*    onClick={this.switchCamera}*/}
                                {/*    value="Switch Camera"*/}
                                {/*/>*/}
                                <input
                                    onClick={this.enterAirHockey}
                                    type="button"
                                    value="에어하키"
                                />
                                <input
                                    onClick={this.enterMovingDuck}
                                    type="button"
                                    value="오리옮기기"
                                />

                                <UseSpeechRecognition sendSignal={this.sendEffectSignal}/>
                            </div>

                            <Cam
                                user={this.props.user}
                                // num={this.props.user.getSubscriber().length + 1}
                                // publisher={this.props.user.getStreamManager()}
                                // subscribers={this.props.user.getSubscriber()}
                            />
                        </div>
                    </>
                    ):null
                }

                {
                    /* 에어하키 구현 */
                    this.props.user.mode === "airHockey" ? (
                        <div>
                        <GameCam 
                            // state={this.state}
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
                    this.props.user.mode === "movingDuck" ? (
                        <div>
                        <GameCam 
                            // state={this.state}
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
            </div>
        )
    }
}
