import UseSpeechRecognition from "../voice/useSpeechRecognition";
import Cam from "./Cam";
import React, {Component} from "react";
import GameCam from "../Games/GameCam";
import SpeechCam from "../Games/speechgame/SpeechCam";
import SpeechGame from "../Games/speechgame/SpeechGame";

export default class CamMain extends Component{

  constructor(props){
    super(props);
    this.enterAirHockey = this.enterAirHockey.bind(this);
    this.enterMovingDuck = this.enterMovingDuck.bind(this);
    this.enterSpeech=this.enterSpeech.bind(this);
    this.sendEffectSignal = this.sendEffectSignal.bind(this);
    this.sendEnterSignal = this.sendEnterSignal.bind(this);
    this.sendRandomPerson= this.sendRandomPerson.bind(this);
    this.getRandomElement= this.getRandomElement.bind(this);
    this.chooseRandom = this.chooseRandom.bind(this)
    this.state = {
      mode: undefined,
    };
  }

  componentDidMount() {
    this.props.user.getStreamManager().stream.session.on("signal:gameRoom", (event) => {
      const data = event.data;
      if (data === "airHockey") {
        this.enterAirHockey();
      } else if (data === "movingDuck") {
        this.enterMovingDuck();
      } else if (data === "speechGame") {
        this.enterSpeech();
        this.chooseRandom();
      }
    });
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
  enterSpeech= ()  => {
    this.setState(prevState => ({
      mode: "speechGame",
    }), () => {
      this.props.onModeChange("speechGame");
    });
  };
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


  sendEnterSignal(string){
    if (this.props.user.getStreamManager().session) {
      this.props.user.getStreamManager().session
        .signal({
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
  /*----------------------------우현 발음게임----------------------------------------
   *----------------------------------------------------------------------------*/
  /*================== 랜덤에 걸린애 Id 보냄 ==================*/ // 일단 얘 보류
  sendRandomPerson(string){
    if (this.props.user.getStreamManager().session) {
      this.props.user.getStreamManager().session
        .signal({
          data: string,
          to: [],
          type: "random",
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
  /*================== 랜덤으로 사람뽑는 애들 ==================*/
  /*======================================================*/
  getRandomElement(list) {
    if (list.length === 0) {
      console.log("여기 Null 값이다.")
      return null;
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }
  chooseRandom() {
    const peopleList = [...this.props.user.subscribers];
    peopleList.push(this.props.user.streamManager);
    console.log("ssssssssssssss", peopleList);
    const test = this.getRandomElement(peopleList).stream.connection.connectionId;
    console.log("test1", test);
    console.log("test2", peopleList);
    return test
  }

  /*======================================================*/
  /*======================================================*/

  /*---------------------------------------------------------------------------
   *---------------------------------------------------------------------------*/
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
                  <h1 id="session-title">"mysession id 따와야됨" </h1>
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
                    onClick={() => this.sendEnterSignal("airHockey")}
                    type="button"
                    value="에어하키"
                  />
                  <input
                    onClick={() => this.sendEnterSignal("movingDuck")}
                    type="button"
                    value="오리옮기기"
                  />

                  <input
                    onClick={() => this.sendEnterSignal("speechGame")}
                    type="button"
                    value="발음게임"
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

        {
          /* 발음 게임 */
          this.state.mode === "speechGame" ? (
            <div>
              {/*<SpeechCam*/}
              {/*selectId={this.chooseRandom()} // 랜덤 ID를 key prop으로 넘겨줍니다.*/}
              {/*user = {this.props.user}*/}
              {/*/>*/}
              <SpeechGame selectID ={this.chooseRandom()} user ={this.props.user}/>

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
