import UseSpeechRecognition from "../voice/useSpeechRecognition";
import Cam from "./Cam";
import React, {Component} from "react";
import GameCam from "../Games/GameCam";
import UserModel from "../models/user-model";

export default class CamMain extends Component{
    constructor(props){
        super(props);
        this.enterAirHockey = this.enterAirHockey.bind(this);
        this.enterMovingDuck = this.enterMovingDuck.bind(this);
        this.sendEffectSignal = this.sendEffectSignal.bind(this);
        this.state = {
            mode: undefined
        };
    }


    enterAirHockey= ()  => {
        this.setState(prevState => ({
            mode: "airHockey",
        }), () => {
            this.props.onModeChange("airHockey");
        });
    };

    enterMovingDuck= ()  => {
        this.setState(prevState => ({
            mode: "movingDuck",
        }), () => {
            this.props.onModeChange("movingDuck");
        });
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
        console.log('cammain rendered##########');
        console.log(this.props);
        console.log(this.state.mode);
        return(
            <div>
                {   /* Main Room */
                    this.state.mode === undefined ? (
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
            </div>
        )
    }
}
