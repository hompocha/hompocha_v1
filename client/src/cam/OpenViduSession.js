import React, { Component } from "react";
import UserModel from "../models/user-model";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UseSpeechRecognition from "../voice/useSpeechRecognition";

const APPLICATION_SERVER_URL = `${process.env.REACT_APP_API_URL}`;
let localUser = new UserModel();

export default class OpenViduSession extends Component {
  constructor(props) {
    super(props);
    const idx = props.idx;
    this.state = {
      mySessionId: idx,
      myUserName: "Hompocha" + Math.floor(Math.random() * 100),
      session: idx,
      mainStreamManager: undefined, // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
      publisher: undefined,
      subscribers: [],
      sessionConnected: false,
      mode: undefined,
    };
    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.handleSessionConnected = this.handleSessionConnected.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    // this.switchCamera = this.switchCamera.bind(this);
    // this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    // this.sendSignal = this.sendSignal.bind(this);
    // this.sendSpeech = this.sendSpeech.bind(this);
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);
    this.joinSession();
  }
  componentWillUnmount() {
    /*윈도우 창 끄는거임*/
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }
  onbeforeunload(event) {
    this.leaveSession();
  }
  handleSessionConnected = () => {
    this.setState({ sessionConnected: true });
    this.props.onSessionConnect(localUser);
  };
  /* 세션 수동입력하는 함수 */
  // handleChangeSessionId(e) {
  //     this.setState({
  //         mySessionId: e.target.value,
  //     });
  // }
  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
      localUser.setSubscriber(subscribers);
      localUser = Object.assign(new UserModel(), localUser);
      this.props.setUserStream(localUser);
    }
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });

      localUser.setStreamManager(stream);
      localUser = Object.assign(new UserModel(), localUser);
      this.props.setUserStream(localUser);
    }
  }
  joinSession() {
    this.OV = new OpenVidu();
    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        let mySession = this.state.session;

        mySession.on("streamCreated", (event) => {
          console.log("stream created");
          const subscriber = mySession.subscribe(event.stream, undefined);
          const subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          this.setState({
            subscribers: subscribers,
          });
          localUser.setSubscriber(subscribers);
          localUser = Object.assign(new UserModel(), localUser);
          this.props.setUserStream(localUser);
        });
        mySession.on("streamDestroyed", (event) => {
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        // -------------------
        this.getToken().then((token) => {
          mySession
            .connect(token)
            .then(async () => {
              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = await this.OV.initPublisherAsync(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
              });
              // --- 6) Publish your stream ---

              mySession.publish(publisher);
              localUser.setConnectionId(
                this.state.session.connection.connectionId
              );
              localUser.setStreamManager(publisher);
              localUser.setSubscriber(this.state.subscribers);
              this.handleSessionConnected();

              // Obtain the current video device in use
              const devices = await this.OV.getDevices();
              const videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
              );
              const currentVideoDeviceId = publisher.stream
                .getMediaStream()
                .getVideoTracks()[0]
                .getSettings().deviceId;
              const currentVideoDevice = videoDevices.find(
                (device) => device.deviceId === currentVideoDeviceId
              );

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                currentVideoDevice: currentVideoDevice,
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    );
    console.log(this.state);
  }
  leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "SessionA",
      myUserName: "Hompocha" + Math.floor(Math.random() * 100),
      mainStreamManager: undefined,
      publisher: undefined,
    });
  }

  /* Session 생성, 토큰 생성 */
  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    console.log(sessionId);
    return await this.createToken(sessionId);
  }

  async createSession(sessionId) {
    console.log(APPLICATION_SERVER_URL, "/openvidu/");
    const connect = await axios.get(APPLICATION_SERVER_URL + "/openvidu/");
    console.log(connect, "createSession");
    const response = await axios.post(
      APPLICATION_SERVER_URL + "/openvidu/sessions",
      {
        customSessionId: sessionId,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // The sessionId
  }

  async createToken(sessionId) {
    console.log(
      APPLICATION_SERVER_URL,
      "/openvidu/sessions/",
      sessionId,
      "/connections"
    );
    const response = await axios.post(
      APPLICATION_SERVER_URL +
        "/openvidu/sessions/" +
        sessionId +
        "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(response.data);
    return response.data; // The token
  }

  render() {
    return (
      <>
        {/* this.state.session !== undefined ? (
          <>
            <UseSpeechRecognition
              sendSignal={this.sendSignal}
              sendSpeech={this.sendSpeech}
            />
          </>
        ) : null */}
      </>
    );
  }
}
