import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatComponent.module.css";
import "./ChatComponent.module.css";

export default function ChatComponent(props) {
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const chatScroll = useRef();

  useEffect(() => {
    if (props.sessionConnected) {
      props.user
        .getStreamManager()
        .stream.session.on("signal:chat", (event) => {
          const data = JSON.parse(event.data);
          console.log("set Message");
          setMessageList((prevMessageList) => [
            ...prevMessageList,
            { connectionId: event.from.connectionId, message: data.message },
          ]);
          scrollToBottom();
        });
    }
  }, [props.sessionConnected]);
  // , props.user]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handlePressKey = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (props.user && message) {
      console.log(message);
      let messageStr = message.replace(/ + (?= )/g, "");
      if (messageStr !== "" && messageStr !== " ") {
        const data = {
          message: messageStr,
          streamId: props.user.getStreamManager().stream.streamId,
        };
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      try {
        chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
      } catch (err) {}
    }, 20);
  };

  const styleChat = { display: props.chatDisplay };

  return (
    <div id="chatContainer" className={styles.chatContainer}>
      <div id="chatComponent" style={styleChat}>
        <div id="chatToolbar">
          <span>
            {props.user.getStreamManager().stream.session.sessionId} - CHAT
          </span>
        </div>
        <div className="message-wrap" ref={chatScroll}>
          {messageList.map((data, i) => (
            <div
              key={i}
              id="remoteUsers"
              className={
                "message" +
                (data.connectionId !== props.user.getConnectionId()
                  ? " left"
                  : " right")
              }
            >
              <div className="msg-detail">
                <div className="msg-content">
                  <span className="triangle" />
                  <p className="text">{data.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div id="messageInput">
          <input
            placeholder="Send a messge"
            id="chatInput"
            value={message}
            onChange={handleChange}
            onKeyPress={handlePressKey}
          />
          <button id="sendButton" onClick={sendMessage}></button>
        </div>
      </div>
    </div>
  );
}